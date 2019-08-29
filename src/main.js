/* CONSTANTS */

// Correspond to assets dirnames
const categoryEnum = {
  base: 'base',
  face: 'facial-expression',
  goggles: 'goggles',
  hair: 'hair',
  helmet: 'helmet',
  mask: 'mask',
  weapon: 'weapon',
  words: 'words',
}

const categoriesInOrder = [
  categoryEnum.base,
  categoryEnum.face,
  categoryEnum.hair,
  categoryEnum.helmet,
  categoryEnum.mask,
  categoryEnum.goggles,
  categoryEnum.weapon,
  categoryEnum.words,
]

const cateLabel = {
  [categoryEnum.base]: '場景',
  [categoryEnum.face]: '面容',
  [categoryEnum.hair]: '頭髮',
  [categoryEnum.helmet]: '頭盔',
  [categoryEnum.mask]: '面罩',
  [categoryEnum.goggles]: '眼鏡',
  [categoryEnum.weapon]: '配件',
  [categoryEnum.words]: '文字',
}

const cateAssetsCount = {
  [categoryEnum.base]: 4,
  [categoryEnum.face]: 6,
  [categoryEnum.hair]: 7,
  [categoryEnum.helmet]: 5,
  [categoryEnum.mask]: 4,
  [categoryEnum.goggles]: 5,
  [categoryEnum.weapon]: 5,
  [categoryEnum.words]: 4,
}

const assetsOrigin = ''
const assetsPath = 'assets'
const assetsType = {
  icons: 'icons',
  preview: 'preview',
  output: 'output',
}

const pixiOptions = {
  backgroundColor: 0x1099bb,
  // resolution: window.devicePixelRatio || 1,
  preserveDrawingBuffer: false,
  antialias: true,
}

/* STATE */

const state = {
  currentCategoryIndex: 0,
  currentItemIndex: {
    [categoryEnum.base]: 0,
    [categoryEnum.face]: 0,
    [categoryEnum.hair]: 0,
    [categoryEnum.helmet]: 0,
    [categoryEnum.mask]: 0,
    [categoryEnum.goggles]: 0,
    [categoryEnum.weapon]: 0,
    [categoryEnum.words]: 0,
  },
  previewSize: 500,
}

/* UTILS*/

/**
 * @param {string} category
 * @param {string} type - 'icons', 'preview' or 'output'
 * @param {number} index
 * @returns {string}
 */
function getImageSrc(category, type, index) {
  return `${assetsOrigin}${assetsPath}/${type}/${category}/${_.padStart(index.toString(), 2, '0')}.png`
}

// /**
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
function downloadCanvasAsPNG(canvas, filename) {
  /// create an "off-screen" anchor tag
  const image = canvas.toDataURL('image/png')
  const lnk = document.createElement('a')
  lnk.download = filename
  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvas.toDataURL('image/png')
  /// create a "fake" click-event to trigger the download
  if (typeof document.createEvent === 'function') {
    const e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false,
      false, 0, null);
    lnk.dispatchEvent(e);
  } else if (typeof lnk.fireEvent === 'function') {
    lnk.fireEvent("onclick");
  }
}

function onImageLoaded(url, cb) {
  var image = new Image()
  image.src = url

  if (image.complete) {
    // 圖片已經被載入
    cb(image)
  } else {
    // 如果圖片未被載入，則設定載入時的回調
    image.onload = function () {
      cb(image)
    }
  }
}


function createHDimage() {
  const pixiApp = new PIXI.Application({
    ...pixiOptions,
    width: 2048,
    height: 2048,
  })
  const loadImageTasks = []
  categoriesInOrder.forEach((categoryEnum) => {
    const itemIndex = state.currentItemIndex[categoryEnum]
    if (itemIndex > 0) {
      const container = new PIXI.Container()
      const src = getImageSrc(categoryEnum, assetsType.output, itemIndex)
      loadImageTasks.push(new Promise((resolve) => {
        onImageLoaded(src, (image) => {
          const sprite = PIXI.Sprite.from(image)
          sprite.width = 2048
          sprite.height = 2048
          container.removeChildren() // clear container
          container.addChild(sprite)
          resolve()
        })
      }))
      pixiApp.stage.addChild(container)
    }
  })
  return Promise.all(loadImageTasks)
    .then(() => {
      setTimeout(() => {
        pixiApp.destroy()
      }, 10000)
      return pixiApp.renderer.extract.canvas(pixiApp.stage)
    })
}


/* RUN APP */

$(document).ready(function () {

  function handleResize() {
    try {
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      const nextPreviewSize = viewportWidth * 0.9 > 500 ? 500 : viewportWidth * 0.9
      setState({
        previewSize: nextPreviewSize,
      })
    } catch(err) {
      console.error('Error on resizing:', err)
    }
  }

  handleResize()

  /* ACTIONS */

  /**
   *
   *
   * @param {Object} [stateToMerge={}]
   * @param {boolean} [forceUpdate=false]
   */
  function setState(stateToMerge = {}, forceUpdate = false) {
    /* Handle currentCategoryIndex change */
    const nextCategoryIndex = _.get(stateToMerge, 'currentCategoryIndex')
    if (typeof nextCategoryIndex === 'number' && (nextCategoryIndex !== state.currentCategoryIndex || forceUpdate)) {
      const nextCategory = categoriesInOrder[nextCategoryIndex]
      // Update controls
      controls.focusCategory(nextCategoryIndex)
      controls.reRenderItems(nextCategoryIndex)
      controls.focusItem(state.currentItemIndex[nextCategory])
    }
    /* Handle currentItemIndex change */
    const currentCategory = categoriesInOrder[state.currentCategoryIndex]
    const nextItemIndex = _.get(stateToMerge, ['currentItemIndex', currentCategory])
    if (typeof nextItemIndex === 'number') {
      controls.focusItem(nextItemIndex)
      preview.updateItem(state.currentCategoryIndex, nextItemIndex)
    }
    /* Update State */
    _.merge(state, stateToMerge)
  }

  const controls = {
    focusCategory: (targetCategoryIndex) => {
      // defocus current category
      $(`#cate-${categoriesInOrder[state.currentCategoryIndex]}`).removeClass('focus')
      // focus target category
      $(`#cate-${categoriesInOrder[targetCategoryIndex]}`).addClass('focus')
    },

    focusItem: (targetItemIndex) => {
      // defocus current item
      const currentCategory = categoriesInOrder[state.currentCategoryIndex]
      $(`#item-${state.currentItemIndex[currentCategory]}`).removeClass('focus')
      // focus target item
      $(`#item-${targetItemIndex}`).addClass('focus')
    },

    reRenderItems: (targetCategoryIndex) => {
      $('#items').empty() // clear all items
      const targetCategory = categoriesInOrder[targetCategoryIndex]
      const assetsCount = cateAssetsCount[targetCategory]
      const $emptyItem = $('<div class="item" id="item-0"></div>')
      const $items = [$emptyItem]
      for (let i = 1; i <= assetsCount; i += 1) {
        const src = getImageSrc(targetCategory, assetsType.icons, i)
        const $item = $(`<div class="item" id="item-${i}"><img src=${src} /></div>`)
        $items.push($item)
      }
      $items.forEach(
        ($item, i) => {
          $item.click(() => {
            setState({
              currentItemIndex: {
                [targetCategory]: i,
              }
            })
          })
        })
      $('#items').append($emptyItem, $items)
    }
  }

  const preview = {
    updateItem: (targetCategoryIndex, targetItemIndex) => {
      const targetCategory = categoriesInOrder[targetCategoryIndex]
      const container = containers[targetCategory]
      if (targetItemIndex > 0) {
        const src = getImageSrc(targetCategory, assetsType.preview, targetItemIndex)
        onImageLoaded(src, (image) => {
          const sprite = PIXI.Sprite.from(image)
          sprite.width = state.previewSize
          sprite.height = state.previewSize
          container.removeChildren() // clear container
          container.addChild(sprite)
        })
        // const textute = PIXI.Texture.from(src)
        
        // textute.baseTexture.on('loaded', () => {
        // })
      } else {
        container.removeChildren()
      }
    }
  }

  function handleNext() {
    const targetIndex = state.currentCategoryIndex === (categoriesInOrder.length - 1) ? 0 : state.currentCategoryIndex + 1
    setState({
      currentCategoryIndex: targetIndex
    })
  }

  function handlePrev() {
    const targetIndex = state.currentCategoryIndex > 0 ? state.currentCategoryIndex - 1 : categoriesInOrder.length - 1
    setState({
      currentCategoryIndex: targetIndex
    })
  }

  /* PREPARE ELEMENTS */

  // Init PIXI
  const pixiApp = new PIXI.Application({
    ...pixiOptions,
    width: state.previewSize,
    height: state.previewSize,
  })
  // Setup containers in PIXI
  const containers = {}
  categoriesInOrder.forEach((categoryEnum) => {
    containers[categoryEnum] = new PIXI.Container()
    pixiApp.stage.addChild(containers[categoryEnum])
  })

  // Render PIXI preview
  $('#preview').append(pixiApp.view);

  // Render category and item buttons
  categoriesInOrder.forEach((categoryEnum, i) => {
    const $category = $(`<div id="cate-${categoryEnum}" class="category">${cateLabel[categoryEnum]}</div>`)
    $('#categories').append($category)
    $category.click(() => {
      setState({
        currentCategoryIndex: i
      })
    })
  })

  // Set initial state
  setState({
    currentCategoryIndex: state.currentCategoryIndex,
  }, true)

  // Bind listener to 'prev' and 'next' buttons
  $('#prev-category').click(handlePrev)
  $('#next-category').click(handleNext)
  // Bind listener to 'download' button
  // $('#download').click(() => downloadCanvasAsPNG(pixiApp.renderer.extract.canvas(pixiApp.stage), 'i-support-hk.png'))
  $('#download').click(() => {
    createHDimage()
      .then(canvas => {
        downloadCanvasAsPNG(canvas, 'i-support-hk.png')
      })
  })
});