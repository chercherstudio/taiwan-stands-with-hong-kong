"use strict";

var _currentItemIndex, _count, _itemSrcs, _containers;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var categoryEnum = {
  face: 'face',
  body: 'body',
  goggles: 'goggles',
  hair: 'hair',
  hat: 'hat',
  mask: 'mask'
};
var categoriesInOrder = [categoryEnum.body, categoryEnum.face, categoryEnum.hair, categoryEnum.hat, categoryEnum.goggles, categoryEnum.mask];
var defaultCategory = categoryEnum.body; // state

var currentCategoryIndex = 0;
var currentItemIndex = (_currentItemIndex = {}, _defineProperty(_currentItemIndex, categoryEnum.body, 0), _defineProperty(_currentItemIndex, categoryEnum.face, 0), _defineProperty(_currentItemIndex, categoryEnum.hair, 0), _defineProperty(_currentItemIndex, categoryEnum.hat, 0), _defineProperty(_currentItemIndex, categoryEnum.goggles, 0), _defineProperty(_currentItemIndex, categoryEnum.mask, 0), _currentItemIndex);
var spritesCache = {};
var constants = {
  pixi: {
    options: {
      width: 500,
      height: 500,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      preserveDrawingBuffer: false,
      antialias: true
    }
  },
  assets: {
    origin: '',
    path: 'assets',
    count: (_count = {}, _defineProperty(_count, categoryEnum.face, 5), _defineProperty(_count, categoryEnum.body, 1), _defineProperty(_count, categoryEnum.goggles, 3), _defineProperty(_count, categoryEnum.hair, 3), _defineProperty(_count, categoryEnum.hat, 1), _defineProperty(_count, categoryEnum.mask, 3), _count)
  }
};
var itemSrcs = (_itemSrcs = {}, _defineProperty(_itemSrcs, categoryEnum.face, getItemSrcs('face', constants.assets.count.face)), _defineProperty(_itemSrcs, categoryEnum.body, getItemSrcs('body', constants.assets.count.body)), _defineProperty(_itemSrcs, categoryEnum.goggles, getItemSrcs('goggles', constants.assets.count.goggles)), _defineProperty(_itemSrcs, categoryEnum.hair, getItemSrcs('hair', constants.assets.count.hair)), _defineProperty(_itemSrcs, categoryEnum.hat, getItemSrcs('hat', constants.assets.count.hat)), _defineProperty(_itemSrcs, categoryEnum.mask, getItemSrcs('mask', constants.assets.count.mask)), _itemSrcs);
var pixiApp = new PIXI.Application(constants.pixi.options);
var containers = (_containers = {}, _defineProperty(_containers, categoryEnum.face, new PIXI.Container()), _defineProperty(_containers, categoryEnum.body, new PIXI.Container()), _defineProperty(_containers, categoryEnum.goggles, new PIXI.Container()), _defineProperty(_containers, categoryEnum.hair, new PIXI.Container()), _defineProperty(_containers, categoryEnum.hat, new PIXI.Container()), _defineProperty(_containers, categoryEnum.mask, new PIXI.Container()), _containers);
/**
 * @param {string} category
 * @param {number} index
 * @returns {string}
 */

function getImageSrc(category, index) {
  var assetsOrigin = constants.assets.origin;
  var assetsPath = constants.assets.path;
  var src = "".concat(assetsOrigin).concat(assetsPath, "/").concat(category, "/").concat(_.padStart(index.toString(), 2, '0'), ".png");
  return src;
}
/**
 * @param {string} category
 * @param {number} itemsCount
 * @returns {string[]}
 */


function getItemSrcs(category, itemsCount) {
  var srcs = [];

  for (var i = 1; i <= itemsCount; i += 1) {
    var src = getImageSrc(category, i);
    srcs.push(src);
  }

  return srcs;
}
/**
 * @param {PIXI.Container} container
 * @param {string} src
 * @param {string} category
 * @param {number} [index=0]
 */


function renderItem(container, src) {
  if (src) {
    var cachedSprite = _.get(spritesCache, src);

    var sprite = cachedSprite || PIXI.Sprite.from(src);
    if (cachedSprite !== sprite) _.set(cachedSprite, src, sprite);
    sprite.width = constants.pixi.options.width;
    sprite.height = constants.pixi.options.height;
    container.removeChildren(); // clear container

    container.addChild(sprite);
  }
}

function setCurrentItem(category, nextIndex) {
  var container = _.get(containers, category);

  if (nextIndex === 0) {
    container.removeChildren();
  } else {
    var src = _.get(itemSrcs, [category, nextIndex - 1]);

    renderItem(container, src);
  }

  _.set(currentItemIndex, category, nextIndex);
}

function renderItems(nextCategoryIndex) {
  $('#items').empty();
  var $emptyItem = $('<div class="item"></div>');
  var nextCategory = categoriesInOrder[nextCategoryIndex];

  var $items = _.map(itemSrcs[nextCategory], function (src, i) {
    var $item = $("<div class=\"item\"><img src=".concat(src, " /></div>"));
    $item.click(function () {
      setCurrentItem(nextCategory, i + 1);
    });
    return $item;
  });

  $emptyItem.click(function () {
    setCurrentItem(nextCategory, 0);
  });
  $('#items').append($emptyItem, $items);
}

function setCurrentCategory(nextCategoryIndex) {
  if (currentCategoryIndex === nextCategoryIndex) return;
  focusCategory(nextCategoryIndex);
  renderItems(nextCategoryIndex);
  currentCategoryIndex = nextCategoryIndex;
}

function focusCategory(nextCategoryIndex) {
  // defocus current category
  $("#cate-".concat(categoriesInOrder[currentCategoryIndex])).removeClass('focus');
  console.log('off', "#cate-".concat(categoriesInOrder[currentCategoryIndex])); // focus next category

  $("#cate-".concat(categoriesInOrder[nextCategoryIndex])).addClass('focus');
}

function handleNext() {
  var targetIndex = currentCategoryIndex === categoriesInOrder.length - 1 ? 0 : currentCategoryIndex + 1;
  console.log(targetIndex);
  setCurrentCategory(targetIndex);
}

function handlePrev() {
  var targetIndex = currentCategoryIndex > 0 ? currentCategoryIndex - 1 : categoriesInOrder.length - 1;
  console.log(targetIndex);
  setCurrentCategory(targetIndex);
}

$(document).ready(function () {
  $('#avatar').append(pixiApp.view);
  var itemsContainer = $('#items');
  $('#prev-category').click(handlePrev);
  $('#next-category').click(handleNext);
  categoriesInOrder.forEach(function (category, i) {
    // Set container to stahe
    pixiApp.stage.addChild(containers[category]);
    var $category = $("#cate-".concat(category)); // Set focus on default category

    if (i === currentCategoryIndex) {
      $category.addClass('focus');
    }

    $category.click(function () {
      setCurrentCategory(i);
    }); // TODO: render images
    // 
  });
  renderItems(currentCategoryIndex);
});