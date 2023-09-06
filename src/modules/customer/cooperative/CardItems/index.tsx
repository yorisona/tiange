import { CreateElement, RenderContext } from 'vue';

const num2class = new Map([
  [4, 'card-items-grid card-items'],
  [6, 'card-items-grid card-items-big'],
]);

export default {
  name: 'CardItems',
  functional: true,
  render(h: CreateElement, context: RenderContext) {
    const items: { src: string; subtitle: string; title: string }[] = context.props.items;

    const classList = num2class.get(items.length) ?? 'card-items-grid card-items-big five-con';

    return h(
      'div',
      {
        class: classList,
      },
      items.map(item => (
        <div class="card">
          <img src={item.src} loading="lazy" />
          <div class="card-content">
            <p class="card-title" domPropsInnerHTML={item.title}></p>
            <p class="card-subtitle" domPropsInnerHTML={item.subtitle}></p>
          </div>
        </div>
      )),
    );
  },
};
