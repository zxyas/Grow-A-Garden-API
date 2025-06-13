const ListCalculator = {};

const { ItemData, Rarity, Mutations } = require('./FruitDatabase.js');

ListCalculator.deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

ListCalculator.stripFlavourText = function (str) {
  if (str && str !== "") {
    return str.replace(/\[.*?\]/g, "").trim();
  }
  return null;
};

ListCalculator.getFruitData = function (str) {
  const stripped = ListCalculator.stripFlavourText(str);
  return ItemData.find(item => item[0] === stripped) || null;
};

ListCalculator.getMutations = function () {
  return ListCalculator.deepCopy(Mutations);
};

ListCalculator.calculateMutation = function (tool) {
  let count = 1;

  for (const [key, mutation] of Object.entries(ListCalculator.getMutations())) {
    if (tool.attributes && Array.isArray(tool.attributes) && tool.attributes.includes(key)) {
      count += (mutation.ValueMulti - 1);
    }
  }

  return Math.max(1, count);
};

ListCalculator.calculateVariant = function (name) {
  const variant = Rarity.find(v => v[0] === name);
  return variant ? variant[2] : 0;
};

ListCalculator.calculateFruit = function (tool) {
  const itemName = tool.Name || tool.Item_String?.value || tool.name;
  const variant = tool.Variant?.value || "Normal";
  const weight = tool.Weight?.value;

  if (weight == null) return 0;

  const data = ListCalculator.getFruitData(itemName);
  if (!data || data.length < 3) return 0;

  const base = data[2];
  const weightRef = data[1];
  const variantMultiplier = ListCalculator.calculateVariant(variant);
  const mutationMultiplier = ListCalculator.calculateMutation(tool);

  const scaled = base * mutationMultiplier * variantMultiplier;
  const ratio = weightRef > 0 ? Math.max(0.95, weight / weightRef) : 1;

  return Math.round(scaled * ratio * ratio);
};

module.exports = ListCalculator;
