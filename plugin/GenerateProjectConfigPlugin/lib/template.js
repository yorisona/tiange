const enumTemplate = `
  /**  @[describe]  */
  enum @[enumName]{
@[enumItem]
  }

  const @[enumName]Map:Map<@[enumName] | any, string>;
  const @[enumName]Option:TG.OptionType<@[enumName]>[];
`;

module.exports = exports = {
  enumTemplate,
};
