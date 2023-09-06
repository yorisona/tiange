// import { useSunburstColors as colors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';

// 旭日图颜色
// export const useSunburstColors = (() => {
//   const firstLevelColors = ['#4A56FF', '#FF7400', '#F15679'];
//   return firstLevelColors.map((el, idx) => {
//     return {
//       color: el,
//       children:
//         idx === 0
//           ? [colors[0], colors[7], colors[8], colors[2]]
//           : idx === 1
//           ? [colors[1], colors[5], colors[3]]
//           : [colors[4], colors[6], colors[9]],
//       // colors.filter((subEel, subIdx) => {
//       //   if (idx === 0) {
//       //     return subIdx === 0 || subIdx === 7 || subIdx === 8 || subIdx === 2;
//       //   } else if (idx === 1) {
//       //     return subIdx === 1 || subIdx === 5 || subIdx === 3;
//       //   } else {
//       //     return subIdx === 4 || subIdx === 6 || subIdx === 9;
//       //   }
//       // }),
//     };
//   });
// })();

// 旭日图颜色
export const useSunburstColors = [
  {
    color: '#164EFF',
    children: [
      {
        color: '#00B1FB',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#4FCA50',
        children: [
          '#87D6C3',
          '#19B18D',
          '#C4E1A6',
          '#00BBFF',
          '#7ED852',
          '#26E5B8',
          '#6195FF',
          '#13C2C2',
          '#00D2FF',
          '#2596FF',
        ],
      },
      {
        color: '#9273F8',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#11CAA7',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#79AF50',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#6876D7',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#36CFC9',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
      {
        color: '#3679FF',
        children: [
          '#2596FF',
          '#00D2FF',
          '#13C2C2',
          '#6195FF',
          '#26E5B8',
          '#7ED852',
          '#00BBFF',
          '#C4E1A6',
          '#19B18D',
          '#87D6C3',
        ],
      },
    ],
  },
  {
    color: '#FF7400',
    children: [
      {
        color: '#FFBF00',
        children: [
          '#FADB14',
          '#FFA400',
          '#FFDEAD',
          '#FF7F50',
          '#F3A461',
          '#FFDAB9',
          '#DBA421',
          '#FFCF8A',
          '#FA9797',
          '#FAA62E',
        ],
      },
      {
        color: '#FFAB33',
        children: [
          '#FAA62E',
          '#FA9797',
          '#FFCF8A',
          '#DBA421',
          '#FFDAB9',
          '#FF7F50',
          '#F3A461',
          '#FFDEAD',
          '#FFA400',
          '#FADB14',
        ],
      },
      {
        color: '#DEA20C',
        children: [
          '#EFB623',
          '#F1BC34',
          '#F3C44D',
          '#F4CA60',
          '#F6D379',
          '#F7DA91',
          '#F9E1A5',
          '#F9E6B5',
          '#FCEFCE',
          '#FDF6E6',
        ],
      },
      {
        color: '#F3A461',
        children: [
          '#FCC624',
          '#FACD47',
          '#FFD350',
          '#FED762',
          '#FFDD78',
          '#FFE376',
          '#FFECA0',
          '#FDF0BB',
          '#FFEBB0',
          '#FDF0C8',
        ],
      },
      {
        color: '#FFCF8A',
        children: [
          '#F76363',
          '#F86C6C',
          '#F97575',
          '#F98282',
          '#FA8B8B',
          '#FA9797',
          '#FBA0A0',
          '#FBA8A8',
          '#FBB4B4',
          '#FDC3C3',
        ],
      },
      {
        color: '#FF7F50',
        children: [
          '#E95D5D',
          '#EA6666',
          '#ED7676',
          '#EF8585',
          '#F09090',
          '#F19A9A',
          '#F2A5A5',
          '#F4B1B1',
          '#F7C2C2',
          '#F9D2D2',
        ],
      },
      {
        color: '#FADB14',
        children: [
          '#DA4343',
          '#DC4E4E',
          '#DE5858',
          '#E16666',
          '#E37171',
          '#E67E7E',
          '#E88989',
          '#EB9C9C',
          '#EDA7A7',
          '#F2BBBB',
        ],
      },
      {
        color: '#FA9797',
        children: [
          '#D02E27',
          '#D33E37',
          '#D74F49',
          '#DB605B',
          '#DE706B',
          '#E27F7B',
          '#E58C88',
          '#E79794',
          '#EBA7A4',
          '#EFB8B6',
        ],
      },
    ],
  },
  {
    color: '#6C49D7',
    children: [
      {
        color: '#9E82FD',
        children: [
          '#BA55D3',
          '#DD9FDD',
          '#FFBFCB',
          '#DB7092',
          '#D8BFD8',
          '#E8977A',
          '#CD5D5B',
          '#BC8F8F',
          '#E277D9',
          '#DB7092',
        ],
      },
      {
        color: '#B93EF7',
        children: [
          '#DB7092',
          '#E277D9',
          '#CD5D5B',
          '#E8977A',
          '#FFBFCB',
          '#DB7092',
          '#DD9FDD',
          '#D8BFD8',
          '#BC8F8F',
          '#BA55D3',
        ],
      },
      {
        color: '#D28CCE',
        children: [
          '#E130AE',
          '#E934B5',
          '#E934B5',
          '#F84CC7',
          '#FF61D2',
          '#FF6DD5',
          '#FB81D8',
          '#FF91DF',
          '#F8A1DF',
          '#FBBFE9',
        ],
      },
    ],
  },
  {
    color: '#e22222',
    children: [
      {
        color: '#FA7F6F',
        children: [
          '#CD5D5B',
          '#F08080',
          '#E8977A',
          '#FFC7C0',
          '#F67C55',
          '#FA8172',
          '#FFA07A',
          '#BC8F8F',
          '#F4B3CF',
          '#FF6550',
        ],
      },
      {
        color: '#F2759D',
        children: [
          '#FF6550',
          '#F4B3CF',
          '#BC8F8F',
          '#FFA07A',
          '#FA8172',
          '#F67C55',
          '#FFC7C0',
          '#E8977A',
          '#F08080',
          '#CD5D5B',
        ],
      },
      {
        color: '#FFA8A3',
        children: [],
      },
    ],
  },
];
