const categoryEnum = {
  face: 'face',
  body: 'body',
  goggles: 'goggles',
  hair: 'hair',
  hat: 'hat',
  mask: 'mask',
}

const categoriesInOrder = [
  categoryEnum.body,
  categoryEnum.face,
  categoryEnum.hair,
  categoryEnum.hat,
  categoryEnum.goggles,
  categoryEnum.mask,
]

const defaultCategory = categoryEnum.body

// state
let currentCategoryIndex = 0
const currentItemIndex = {
  [categoryEnum.body]: 0,
  [categoryEnum.face]: 0,
  [categoryEnum.hair]: 0,
  [categoryEnum.hat]: 0,
  [categoryEnum.goggles]: 0,
  [categoryEnum.mask]: 0,
}
const spritesCache = {}

const constants = {
  pixi: {
    options: {
      width: 500,
      height: 500,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      preserveDrawingBuffer: false,
      antialias: true,
    } 
  },
  assets: {
    origin: '',
    path: 'assets',
    count: {
      [categoryEnum.face]: 5,
      [categoryEnum.body]: 1,
      [categoryEnum.goggles]: 3,
      [categoryEnum.hair]: 3,
      [categoryEnum.hat]: 1,
      [categoryEnum.mask]: 3,
    }
  }
}

const itemSrcs = {
  [categoryEnum.face]: getItemSrcs('face', constants.assets.count.face),
  [categoryEnum.body]: getItemSrcs('body', constants.assets.count.body),
  [categoryEnum.goggles]: getItemSrcs('goggles', constants.assets.count.goggles),
  [categoryEnum.hair]: getItemSrcs('hair', constants.assets.count.hair),
  [categoryEnum.hat]: getItemSrcs('hat', constants.assets.count.hat),
  [categoryEnum.mask]: getItemSrcs('mask', constants.assets.count.mask),
}

const pixiApp = new PIXI.Application(constants.pixi.options)
const containers = {
  [categoryEnum.face]: new PIXI.Container(),
  [categoryEnum.body]: new PIXI.Container(),
  [categoryEnum.goggles]: new PIXI.Container(),
  [categoryEnum.hair]: new PIXI.Container(),
  [categoryEnum.hat]: new PIXI.Container(),
  [categoryEnum.mask]: new PIXI.Container(),
}

/**
 * @param {string} category
 * @param {number} index
 * @returns {string}
 */
function getImageSrc(category, index) {
  const assetsOrigin = constants.assets.origin
  const assetsPath = constants.assets.path
  const src = `${assetsOrigin}${assetsPath}/${category}/${_.padStart(index.toString(), 2, '0')}.png`
  return src
}

/**
 * @param {string} category
 * @param {number} itemsCount
 * @returns {string[]}
 */
function getItemSrcs(category, itemsCount) {
  const srcs = []
  for (let i = 1; i <= itemsCount; i += 1) {
    const src = getImageSrc(category, i)
    srcs.push(src)
  }
  return srcs
}

/**
 * @param {PIXI.Container} container
 * @param {string} src
 * @param {string} category
 * @param {number} [index=0]
 */
function renderItem(container, src) {
  if (src) {
    const cachedSprite = _.get(spritesCache, src)
    const sprite = cachedSprite || PIXI.Sprite.from(src)
    if (cachedSprite !== sprite) _.set(cachedSprite, src, sprite)
    sprite.width = constants.pixi.options.width
    sprite.height = constants.pixi.options.height
    container.removeChildren() // clear container
    container.addChild(sprite)
  }
}

function setCurrentItem(category, nextIndex) {
  const container = _.get(containers, category)
  if (nextIndex === 0) {
    container.removeChildren()
  } else {
    const src = _.get(itemSrcs, [category, nextIndex - 1])
    renderItem(container, src)
  }
  _.set(currentItemIndex, category, nextIndex)
}

function renderItems(nextCategoryIndex) {
  $('#items').empty()
  const $emptyItem = $('<div class="item"></div>')
  const nextCategory = categoriesInOrder[nextCategoryIndex]
  const $items = _.map(itemSrcs[nextCategory], (src, i) => {
    const $item = $(`<div class="item"><img src=${src} /></div>`)
    $item.click(() => { setCurrentItem(nextCategory, i + 1) })
    return $item
  })
  $emptyItem.click(() => { setCurrentItem(nextCategory, 0) })
  $('#items').append($emptyItem, $items)
}

function setCurrentCategory(nextCategoryIndex) {
  if (currentCategoryIndex === nextCategoryIndex) return
  focusCategory(nextCategoryIndex)
  renderItems(nextCategoryIndex)
  currentCategoryIndex = nextCategoryIndex
}

function focusCategory(nextCategoryIndex) {
  // defocus current category
  $(`#cate-${categoriesInOrder[currentCategoryIndex]}`).removeClass('focus')
  console.log('off', `#cate-${categoriesInOrder[currentCategoryIndex]}`)
  // focus next category
  $(`#cate-${categoriesInOrder[nextCategoryIndex]}`).addClass('focus')
}

function handleNext() {
  const targetIndex = currentCategoryIndex === (categoriesInOrder.length - 1) ? 0 : currentCategoryIndex + 1
  console.log(targetIndex)
  setCurrentCategory(targetIndex)
}

function handlePrev() {
  const targetIndex = currentCategoryIndex > 0 ? currentCategoryIndex - 1 : categoriesInOrder.length - 1
  console.log(targetIndex)
  setCurrentCategory(targetIndex)
}

$(document).ready(function(){
  $('#avatar').append(pixiApp.view);
  const itemsContainer = $('#items')
  $('#prev-category').click(handlePrev)
  $('#next-category').click(handleNext)
  categoriesInOrder.forEach((category, i) => {
    // Set container to stahe
    pixiApp.stage.addChild(containers[category])
    const $category = $(`#cate-${category}`)
    // Set focus on default category
    if (i === currentCategoryIndex) {
      $category.addClass('focus')
    }
    $category.click(() => { setCurrentCategory(i) })
    // TODO: render images
    // 
  })
  renderItems(currentCategoryIndex)
}); 