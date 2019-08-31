"use strict";

var _cateLabel, _cateAssetsCount, _currentItemIndex;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* CONSTANTS */
// Correspond to assets dirnames
var categoryEnum = {
  frame: 'frame',
  base: 'base',
  face: 'facial-expression',
  goggles: 'goggles',
  hair: 'hair',
  helmet: 'helmet',
  mask: 'mask',
  weapon: 'weapon',
  words: 'words'
};
var categoriesInOrder = [categoryEnum.base, categoryEnum.face, categoryEnum.hair, categoryEnum.helmet, categoryEnum.mask, categoryEnum.goggles, categoryEnum.weapon, categoryEnum.words, categoryEnum.frame];
var cateoriesNotInControl = [categoryEnum.frame];
var cateLabel = (_cateLabel = {}, _defineProperty(_cateLabel, categoryEnum.base, '場景'), _defineProperty(_cateLabel, categoryEnum.face, '面容'), _defineProperty(_cateLabel, categoryEnum.hair, '頭髮'), _defineProperty(_cateLabel, categoryEnum.helmet, '頭盔'), _defineProperty(_cateLabel, categoryEnum.mask, '面罩'), _defineProperty(_cateLabel, categoryEnum.goggles, '眼鏡'), _defineProperty(_cateLabel, categoryEnum.weapon, '配件'), _defineProperty(_cateLabel, categoryEnum.words, '文字'), _cateLabel);
var cateAssetsCount = (_cateAssetsCount = {}, _defineProperty(_cateAssetsCount, categoryEnum.base, 6), _defineProperty(_cateAssetsCount, categoryEnum.face, 7), _defineProperty(_cateAssetsCount, categoryEnum.hair, 8), _defineProperty(_cateAssetsCount, categoryEnum.helmet, 4), _defineProperty(_cateAssetsCount, categoryEnum.mask, 5), _defineProperty(_cateAssetsCount, categoryEnum.goggles, 5), _defineProperty(_cateAssetsCount, categoryEnum.weapon, 8), _defineProperty(_cateAssetsCount, categoryEnum.words, 6), _defineProperty(_cateAssetsCount, categoryEnum.frame, 1), _cateAssetsCount);
var assetsOrigin = '';
var assetsPath = 'assets';
var assetsType = {
  icons: 'icons',
  preview: 'preview',
  output: 'output'
};
var pixiOptions = {
  backgroundColor: 'transparent',
  // resolution: window.devicePixelRatio || 1,
  preserveDrawingBuffer: false,
  antialias: true
  /* STATE */

};
var state = {
  currentCategoryIndex: 0,
  currentItemIndex: (_currentItemIndex = {}, _defineProperty(_currentItemIndex, categoryEnum.base, 0), _defineProperty(_currentItemIndex, categoryEnum.face, 0), _defineProperty(_currentItemIndex, categoryEnum.hair, 0), _defineProperty(_currentItemIndex, categoryEnum.helmet, 0), _defineProperty(_currentItemIndex, categoryEnum.mask, 0), _defineProperty(_currentItemIndex, categoryEnum.goggles, 0), _defineProperty(_currentItemIndex, categoryEnum.weapon, 0), _defineProperty(_currentItemIndex, categoryEnum.words, 0), _defineProperty(_currentItemIndex, categoryEnum.frame, 1), _currentItemIndex),
  previewSize: 500
  /* UTILS*/

  /**
   * @param {string} category
   * @param {string} type - 'icons', 'preview' or 'output'
   * @param {number} index
   * @returns {string}
   */

};

function getImageSrc(category, type, index) {
  return "".concat(assetsOrigin).concat(assetsPath, "/").concat(type, "/").concat(category, "/").concat(_.padStart(index.toString(), 2, '0'), ".png");
} // /**
//  * @param {string} category
//  * @param {string} type - 'icons', 'preview' or 'output'
//  * @param {number} itemsCount
//  * @returns {string[]}
//  */
// function getItemSrcs(category, type, itemsCount) {
//   const srcs = []
//   for (let i = 1; i <= itemsCount; i += 1) {
//     const src = getImageSrc(category, type, i)
//     srcs.push(src)
//   }
//   return srcs
// }
// Source from:  http://stackoverflow.com/questions/18480474/how-to-save-an-image-from-canvas


function onImageLoaded(url, cb) {
  var image = new Image();
  image.src = url;

  if (image.complete) {
    // 圖片已經被載入
    cb(image);
  } else {
    // 如果圖片未被載入，則設定載入時的回調
    image.onload = function () {
      cb(image);
    };
  }
}
/* RUN APP */


$(document).ready(function () {
  /* For HD output image */
  var hdSize = 2048;

  function downloadCanvasAsPNG(hdPixiApp, filename, $container) {
    /// create an "off-screen" anchor tag
    try {
      var canvas = hdPixiApp.renderer.extract.canvas(hdPixiApp.stage);
      var $image = $('<img />');
      var imageDataURL = canvas.toDataURL('image/png');
      hdPixiApp.destroy();
      var $link = $("<a download=\"".concat(filename, "\">\u6216\u9EDE\u6B64\u9023\u7D50\u4E0B\u8F09</a>")); /// convert canvas content to data-uri for link. When download
      /// attribute is set the content pointed to by link will be
      /// pushed as "download" in HTML5 capable browsers

      $link.attr('href', imageDataURL);
      $image.attr('src', imageDataURL); /// create a "fake" click-event to trigger the download
      // if (typeof document.createEvent === 'function') {
      //   const e = document.createEvent("MouseEvents");
      //   e.initMouseEvent("click", true, true, window,
      //     0, 0, 0, 0, 0, false, false, false,
      //     false, 0, null);
      //   lnk.dispatchEvent(e);
      // } else if (typeof lnk.fireEvent === 'function') {
      //   lnk.fireEvent("onclick");
      // }

      $container.empty();
      $container.append($('<div>右鍵另存圖片</div>'), $image, $('<br />'), $link);
    } catch (error) {
      console.error(error);

      if (typeof window.alert === 'function') {
        window.alert('記憶體不足或瀏覽器錯誤');
      }
    }
  }

  function createHDimage() {
    $('#loader').removeClass('hide');
    var hdPixiApp = new PIXI.Application(_objectSpread({}, pixiOptions, {
      width: hdSize,
      height: hdSize
    }));
    var loadImageTasks = [];
    categoriesInOrder.forEach(function (categoryEnum) {
      var itemIndex = state.currentItemIndex[categoryEnum];

      if (itemIndex > 0) {
        var container = new PIXI.Container();
        var src = getImageSrc(categoryEnum, assetsType.output, itemIndex);
        loadImageTasks.push(new Promise(function (resolve) {
          onImageLoaded(src, function (image) {
            var sprite = PIXI.Sprite.from(image);
            sprite.width = 2048;
            sprite.height = 2048;
            container.removeChildren(); // clear container

            container.addChild(sprite);
            resolve();
          });
        }));
        hdPixiApp.stage.addChild(container);
      }
    });
    return Promise.all(loadImageTasks).then(function () {
      return hdPixiApp;
    });
  }
  /*  */


  function handleResize() {
    try {
      var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var nextPreviewSize = viewportWidth * 0.9 > 500 ? 500 : viewportWidth * 0.9;
      setState({
        previewSize: nextPreviewSize
      });
    } catch (err) {
      console.error('Error on resizing:', err);
    }
  }

  handleResize();
  /* ACTIONS */

  /**
   *
   *
   * @param {Object} [stateToMerge={}]
   * @param {boolean} [forceUpdate=false]
   */

  function setState() {
    var stateToMerge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var forceUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    /* Handle currentCategoryIndex change */
    var nextCategoryIndex = _.get(stateToMerge, 'currentCategoryIndex');

    if (typeof nextCategoryIndex === 'number' && (nextCategoryIndex !== state.currentCategoryIndex || forceUpdate)) {
      var nextCategory = categoriesInOrder[nextCategoryIndex]; // Update controls

      controls.focusCategory(nextCategoryIndex);
      controls.reRenderItems(nextCategoryIndex);
      controls.focusItem(state.currentItemIndex[nextCategory]);
    }
    /* Handle currentItemIndex change */


    var itemsToUpdate = _.get(stateToMerge, ['currentItemIndex']);

    console.log(itemsToUpdate);

    _.forEach(itemsToUpdate, function (nextItemIndex, itemCategory) {
      var currentCategory = categoriesInOrder[state.currentCategoryIndex];

      if (typeof nextItemIndex === 'number' && (nextItemIndex !== state.currentItemIndex[itemCategory] || forceUpdate)) {
        if (currentCategory === itemCategory) {
          controls.focusItem(nextItemIndex);
        }

        console.log('update', _.findIndex(categoriesInOrder, itemCategory), nextItemIndex);
        preview.updateItem(_.findIndex(categoriesInOrder, function (cat) {
          return cat === itemCategory;
        }), nextItemIndex);
      }
    });
    /* Update State */


    _.merge(state, stateToMerge);
  }

  var controls = {
    focusCategory: function focusCategory(targetCategoryIndex) {
      // defocus current category
      $("#cate-".concat(categoriesInOrder[state.currentCategoryIndex])).removeClass('focus'); // focus target category

      $("#cate-".concat(categoriesInOrder[targetCategoryIndex])).addClass('focus');
    },
    focusItem: function focusItem(targetItemIndex) {
      // defocus current item
      var currentCategory = categoriesInOrder[state.currentCategoryIndex];
      $("#item-".concat(state.currentItemIndex[currentCategory])).removeClass('focus'); // focus target item

      $("#item-".concat(targetItemIndex)).addClass('focus');
    },
    reRenderItems: function reRenderItems(targetCategoryIndex) {
      $('#items').empty(); // clear all items

      var targetCategory = categoriesInOrder[targetCategoryIndex];
      var assetsCount = cateAssetsCount[targetCategory];
      var $emptyItem = $('<div class="item" id="item-0"></div>');
      var $items = [$emptyItem];

      for (var i = 1; i <= assetsCount; i += 1) {
        var src = getImageSrc(targetCategory, assetsType.icons, i);
        var $item = $("<div class=\"item\" id=\"item-".concat(i, "\"><img src=").concat(src, " /></div>"));
        $items.push($item);
      }

      $items.forEach(function ($item, i) {
        $item.click(function () {
          setState({
            currentItemIndex: _defineProperty({}, targetCategory, i)
          });
        });
      });
      $('#items').append($emptyItem, $items);
    }
  };
  var preview = {
    updateItem: function updateItem(targetCategoryIndex, targetItemIndex) {
      var targetCategory = categoriesInOrder[targetCategoryIndex];
      var container = containers[targetCategory];

      if (targetItemIndex > 0) {
        var src = getImageSrc(targetCategory, assetsType.preview, targetItemIndex);
        onImageLoaded(src, function (image) {
          var sprite = PIXI.Sprite.from(image);
          sprite.width = state.previewSize;
          sprite.height = state.previewSize;
          container.removeChildren(); // clear container

          container.addChild(sprite);
        }); // const textute = PIXI.Texture.from(src)
        // textute.baseTexture.on('loaded', () => {
        // })
      } else {
        container.removeChildren();
      }
    }
  };

  function handleNext() {
    var targetIndex = state.currentCategoryIndex === categoriesInOrder.length - 1 ? 0 : state.currentCategoryIndex + 1;
    setState({
      currentCategoryIndex: targetIndex
    });
  }

  function handlePrev() {
    var targetIndex = state.currentCategoryIndex > 0 ? state.currentCategoryIndex - 1 : categoriesInOrder.length - 1;
    setState({
      currentCategoryIndex: targetIndex
    });
  }
  /* PREPARE ELEMENTS */
  // Init PIXI


  var pixiApp = new PIXI.Application(_objectSpread({}, pixiOptions, {
    width: state.previewSize,
    height: state.previewSize
  })); // Setup containers in PIXI

  var containers = {};
  categoriesInOrder.forEach(function (categoryEnum) {
    containers[categoryEnum] = new PIXI.Container();
    pixiApp.stage.addChild(containers[categoryEnum]);
  }); // Render PIXI preview

  $('#preview').append(pixiApp.view); // Render category and item buttons

  categoriesInOrder.forEach(function (category, i) {
    if (_.includes(cateoriesNotInControl, category)) {
      return;
    }

    var $category = $("<div id=\"cate-".concat(category, "\" class=\"category\">").concat(cateLabel[category], "</div>"));
    $('#categories').append($category);
    $category.click(function () {
      setState({
        currentCategoryIndex: i
      });
    });
  }); // Set initial state

  setState({
    currentCategoryIndex: state.currentCategoryIndex,
    currentItemIndex: state.currentItemIndex
  }, true); // Bind listener to 'prev' and 'next' buttons

  $('#prev-category').click(handlePrev);
  $('#next-category').click(handleNext); // Bind listener to 'create-avatar' button
  // $('#download').click(() => downloadCanvasAsPNG(pixiApp.renderer.extract.canvas(pixiApp.stage), 'i-support-hk.png'))

  $('#create-avatar').click(function () {
    createHDimage().then(function (hdPixiApp) {
      $('#loader').addClass('hide');
      downloadCanvasAsPNG(hdPixiApp, 'i-support-hk.png', $('#download-avatar'));
    });
  });
});