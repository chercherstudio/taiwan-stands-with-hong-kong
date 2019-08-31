/* CONSTANTS */

// Correspond to assets dirnames
const categoryEnum = {
  frame: 'frame',
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
  categoryEnum.frame,
]

const cateoriesNotInControl = [
  categoryEnum.frame,
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
  [categoryEnum.base]: 6,
  [categoryEnum.face]: 7,
  [categoryEnum.hair]: 8,
  [categoryEnum.helmet]: 4,
  [categoryEnum.mask]: 5,
  [categoryEnum.goggles]: 5,
  [categoryEnum.weapon]: 8,
  [categoryEnum.words]: 6,
  [categoryEnum.frame]: 1,
}

const assetsOrigin = ''
const assetsPath = 'assets'
const assetsType = {
  icons: 'icons',
  preview: 'preview',
  output: 'output',
}

const pixiOptions = {
  backgroundColor: 'transparent',
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
    [categoryEnum.frame]: 1,
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



/* RUN APP */

$(document).ready(function () {
  /* For HD output image */
  const hdSize = 2048

  function downloadCanvasAsPNG(hdPixiApp, filename, $container) {
    /// create an "off-screen" anchor tag
    try {
      const canvas = hdPixiApp.renderer.extract.canvas(hdPixiApp.stage)
      const $image = $('<img />')
      const imageDataURL = canvas.toDataURL('image/png')
      hdPixiApp.destroy()
      const $link = $(`<a download="${filename}">或點此連結下載</a>`)
      /// convert canvas content to data-uri for link. When download
      /// attribute is set the content pointed to by link will be
      /// pushed as "download" in HTML5 capable browsers
      $link.attr('href', imageDataURL)
      $image.attr('src', imageDataURL)
      /// create a "fake" click-event to trigger the download
      // if (typeof document.createEvent === 'function') {
      //   const e = document.createEvent("MouseEvents");
      //   e.initMouseEvent("click", true, true, window,
      //     0, 0, 0, 0, 0, false, false, false,
      //     false, 0, null);
      //   lnk.dispatchEvent(e);
      // } else if (typeof lnk.fireEvent === 'function') {
      //   lnk.fireEvent("onclick");
      // }
      $container.empty()
      $container.append($('<div>右鍵另存圖片</div>'), $image, $('<br />'), $link)
    } catch (error) {
      console.error(error)
      if (typeof window.alert === 'function') {
        window.alert('記憶體不足或瀏覽器錯誤')
      }
    }
  }

  function createHDimage() {
    $('#loader').removeClass('hide')
    const hdPixiApp = new PIXI.Application({
      ...pixiOptions,
      width: hdSize,
      height: hdSize,
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
        hdPixiApp.stage.addChild(container)
      }
    })
    return Promise.all(loadImageTasks)
      .then(() => {
        return hdPixiApp
      })
  }

  /*  */


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
    const itemsToUpdate = _.get(stateToMerge, ['currentItemIndex'])
    console.log(itemsToUpdate)
    _.forEach(itemsToUpdate, (nextItemIndex, itemCategory) => {
      const currentCategory = categoriesInOrder[state.currentCategoryIndex]
      if (typeof nextItemIndex === 'number' && (nextItemIndex !== state.currentItemIndex[itemCategory] || forceUpdate)) {
        if (currentCategory === itemCategory) {
          controls.focusItem(nextItemIndex)
        }
        console.log('update', _.findIndex(categoriesInOrder, itemCategory), nextItemIndex)
        preview.updateItem(_.findIndex(categoriesInOrder, cat => cat === itemCategory), nextItemIndex)
      }
    })
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
  categoriesInOrder.forEach((category, i) => {
    if (_.includes(cateoriesNotInControl, category)) { return }
    const $category = $(`<div id="cate-${category}" class="category">${cateLabel[category]}</div>`)
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
    currentItemIndex: state.currentItemIndex,
  }, true)

  // Bind listener to 'prev' and 'next' buttons
  $('#prev-category').click(handlePrev)
  $('#next-category').click(handleNext)
  // Bind listener to 'create-avatar' button
  // $('#download').click(() => downloadCanvasAsPNG(pixiApp.renderer.extract.canvas(pixiApp.stage), 'i-support-hk.png'))
  $('#create-avatar').click(() => {
    createHDimage()
      .then(hdPixiApp => {
        $('#loader').addClass('hide')
        downloadCanvasAsPNG(hdPixiApp, 'i-support-hk.png', $('#download-avatar'))
      })
  })
});