import Vue from 'vue';

const getSuffix: (t: string) => string = (text: string) => {
  // 正则表达式匹配所有的文件后缀
  const regex = /(\.[^.]+)$/gm;
  const matches = text.match(regex);
  // 如果找到了匹配的后缀，则返回最后一个
  if (matches && matches.length > 0) {
    return matches[matches.length - 1];
  }
  // 没有找到匹配的后缀，返回空字符串
  return '';
};

// 中间省略号,显示文件后缀
const useEllipsisFix = (el: HTMLElement, text: string): void => {
  console.log(getSuffix(text), 'el.style.fontSize');
  if (!getSuffix(text)) {
    el.style.textOverflow = 'ellipsis';
    return;
  }
  const strNumer = text.length; //2. 拿到文字的数量
  const avgStrWidth = el.scrollWidth / strNumer; //3. 拿到平均每个文字多少宽度
  console.log(text, 'el.offsetWidth');

  const canFitStrNumber = Math.floor(
    el.offsetWidth / avgStrWidth, //4. 根据父元素的宽度来计算出可以容纳多少文字
  );
  const shouldDelNumber = strNumer - canFitStrNumber + 1.5; // 省略号的文字占用上，并不能准确的根据文字大小调整所需的字数。也就是下面的 1.5 这个数字无法精确的算出
  const delEachSide = shouldDelNumber / 2; //2. 因为要保留中间,所以我们不能只从开头删除，也需要从两头删除
  /** 取整可能导致最大宽度与实际占用宽度有误差 */
  const endLeft = Math.floor(strNumer / 2 - delEachSide); //3. 因为下面要用到 slice 所以需要计算出 index
  const startRight = Math.ceil(strNumer / 2 + delEachSide); //4. 和上面同理
  // el.textContent = text.slice(0, endLeft) + '...' + text.slice(startRight);
  // Todu 误差修正
  const fs = (text.slice(0, endLeft) + '...' + text.slice(startRight)).length;
  const isIncrement = fs < text.length - 1 && fs <= canFitStrNumber ? 3 : 0;
  el.textContent = text.slice(0, endLeft) + '...' + text.slice(startRight - isIncrement);
  // console.log(
  //   (text.slice(0, endLeft) + '...' + text.slice(startRight)).length,
  //   text.length,
  //   canFitStrNumber,
  //   isIncrement,
  //   '111',
  // );
  // console.log(delEachSide, startRight, endLeft, 'avgStrWidth');
  // console.log(shouldDelNumber, 'shouldDelNumber');
  // console.log(canFitStrNumber, 'canFitStrNumber');
  // console.log(text.slice(0, endLeft), 'text.slice(0, endLeft)');
  // console.log(text.slice(startRight), 'text.slice(startRight)');
};

const createEl = (tag: string, styles: any): HTMLElement => {
  const el = document.createElement(tag);
  Object.assign(el.style, styles);
  return el;
};
export const useEllipsis = () => {
  Vue.directive('ellipsis', {
    bind: function (el, binding) {
      let div: HTMLElement | null = null;
      let coverage = true;
      const leaveTime = 50;
      // 获取指令参数：最大字符数
      const maxChars = binding.value || 20;
      // 判断是px还是百分比
      const unit = binding.value.toString().includes('%')
        ? '%'
        : binding.value.toString().includes('px')
        ? 'px'
        : false;

      // 获取元素的原始文本内容
      const text = el.innerText;
      let getTip: () => void;

      // 浮框
      const tooltipFuc = () => {
        // 创建浮框
        getTip = () => {
          if (div) close();
          // div = document.createElement('div');
          div = createEl('div', {
            position: 'absolute',
            zIndex: '9999',
            background: '#fff',
            boxShadow: '0 1px 10px 0 rgb(47 56 72 / 12%)',
            fontSize: '14px',
            opacity: 0,
            transition: 'opacity .3s ease-in-out',
            maxWidth: '360px',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
          });
          div.id = 'ellipsis';
          const textSpan = createEl('span', {
            display: 'inline-block',
            maxWidth: '100%',
            padding: '10px',
            fontSize: '12px',
            color: 'var(--text-color)',
          });
          textSpan.innerText = text;
          div.appendChild(textSpan);
          // 添加尖角
          const triangle = createEl('span', {
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '5px',
            bottom: '-9px',
            left: '50%',
            marginLeft: '-10px',
            transform: 'rotate(180deg)',
            display: 'block',
            borderColor: 'transparent',
            borderBottomColor: '#fff',
            filter: 'drop-shadow(0 2px 12px rgba(0,0,0,.03))',
          });
          div.appendChild(triangle);
          // 添加尖角边框
          const triangleBorder = createEl('span', {
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            bottom: '-10px',
            left: '50%',
            marginLeft: '-10px',
            transform: 'rotate(180deg)',
            display: 'block',
            borderWidth: '5px',
            filter: 'drop-shadow(rgba(0, 0, 0, 0.03) 0px 2px 12px)',
            borderColor: 'transparent',
            borderBottomColor: 'var(--border-line-other-color)',
            zIndex: '-1',
          });
          div.appendChild(triangleBorder);
          document.body.appendChild(div);

          // 计算浮框位置，放在元素正上方
          const rect = el.getBoundingClientRect();
          let x = rect.left + window.pageXOffset - (div.offsetWidth - el.offsetWidth) / 2;
          // 当元素不定宽时，浮框位置需要偏移(可根据实际调整)
          if (!unit) {
            x = x - rect.width / maxChars / 2;
          }
          const y = rect.top + window.pageYOffset;
          div.style.bottom = `${window.innerHeight - y + 5}px`;
          div.style.left = `${x}px`;
          setTimeout(() => {
            div!.style.opacity = '1';
          }, 10);

          // 头部边界处理
          let element = div as any;
          let distance = element!.offsetTop;
          while (element && element.offsetParent) {
            element = element.offsetParent;
            distance += element.offsetTop;
          }
          // 当浮框触顶时,给予浮框最大高度
          if (distance < 0) {
            // div!.style.maxHeight = `${Math.abs(distance - 10)}px`;
            textSpan!.style.maxHeight = `${rect.top + distance / 2}px`;
            textSpan!.style.overflowY = 'auto';
          }
          // 添加进入浮框事件，销毁浮框
          div?.addEventListener('mouseenter', function (event) {
            coverage = false;
          });
          div?.addEventListener('mouseleave', function (event) {
            coverage = true;
            close();
          });
        };
        // 添加鼠标悬停事件，显示浮框
        el.addEventListener('mouseenter', getTip);

        /* 分辨率改变重新定位 */
        const handler = () => {
          if (!div) return;
          const rect = el.getBoundingClientRect();
          let x = rect.left + window.pageXOffset - (div.offsetWidth - el.offsetWidth) / 2;
          if (!unit) {
            x = x - rect.width / maxChars / 2;
          }
          const y = rect.top + window.pageYOffset;
          div.style.bottom = `${window.innerHeight - y + 5}px`;
          div.style.left = `${x}px`;
        };

        window.addEventListener('resize', handler);

        const close = () => {
          const ellipsis = document.querySelector('#ellipsis') as HTMLDivElement;
          try {
            ellipsis.style.opacity = '0';
            setTimeout(() => {
              document.body?.removeChild(document.querySelector('#ellipsis')!);
              window.removeEventListener('resize', handler);
            }, 300); // 等待过渡效果完成再移除元素
            div = null;
          } catch (e) {
            console.log(e);
          }
        };

        // 添加鼠标离开事件，销毁浮框
        el.addEventListener('mouseleave', function (event) {
          const ellipsis = document.querySelector('#ellipsis');
          if (
            ellipsis &&
            // @ts-ignore
            !ellipsis.contains(event.target as Node)
          ) {
            setTimeout(() => {
              if (coverage) {
                close();
              }
            }, leaveTime);
          }
        });
      };

      const init = (wd?: number) => {
        // 如果文本长度超过最大值，则截取并添加省略号
        if (text.length > maxChars) {
          const extname: string = getSuffix(text);
          el.innerText = text.substring(0, maxChars - extname.length) + '...' + extname;
          console.log(text.substring(0, maxChars - extname.length), 'el.innerText');
          tooltipFuc();
        } else if (unit) {
          // 设置 CSS 样式以强制文本截断并显示省略号
          el.style.maxWidth = `${wd || binding.value}`;
          el.style.overflow = 'hidden';
          // el.style.textOverflow = 'ellipsis';
          el.style.whiteSpace = 'nowrap';
          el.style.wordBreak = 'break-all';

          Vue.nextTick(() => {
            // const Nb = binding.value.toString().split(unit)[0];
            // const elWidth = unit === 'px' ? Nb : el.clientWidth * (Nb / 100);
            const textWidth = el.scrollWidth;
            // console.log(textWidth, el.offsetWidth, 'textWidth');
            if (Number(textWidth) > Number(el.offsetWidth)) {
              useEllipsisFix(el, text);
              tooltipFuc();
            }
          });
        }
      };
      init();
      const observer = new MutationObserver(mutations => {
        mutations.forEach(function (mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // console.log(el.offsetWidth, div, getTip, 'mutation');
            // 清除监听
            if (getTip) el.removeEventListener('mouseenter', getTip);
            // 处理宽度变化的代码
            init(el.offsetWidth);
          }
        });
      });
      Vue.nextTick(() => {
        observer.observe(el as HTMLDivElement, { attributes: true });
      });
    },

    // 对于动态内容的更新，也需要重新处理文本长度和省略号的显示
    update: function (el, binding) {
      const maxChars = binding.value || 20;
      const text = el.innerText;
      if (text.length > maxChars) {
        const extname: string = getSuffix(text);
        el.innerText = text.substring(0, maxChars - extname.length) + '...' + extname;
        console.log(extname, '变化');

        // el.innerText = text.substring(0, maxChars) + '...';
      } else {
        el.innerText = text;
      }
    },
  });
};
