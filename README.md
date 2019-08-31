# taiwan-stands-with-hong-kong

[【反送中，撐香港】大頭貼產生器](https://chercherstudio.github.io/tw-support-hk/)

## 壓縮 png

```bash
# 小圖示 (85x85)
cd icons
mogrify -resize 170x170\> -format png **/*.png
pngquant **/*.png --ext .png -f

# 預覽用 (500x500)
cd preview
mogrify -resize 1000x1000\> -format png **/*.PNG
pngquant **/*.png --ext .png -f

# 壓縮大圖（1024 x 1024）
cd output
pngquant **/*.PNG --ext .png -f

```
