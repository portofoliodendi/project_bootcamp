const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch').default;
const { PNG } = require('pngjs');

async function compareScreenshot(driver, imageName, maxDiffPercent = 1) {
    const baselineDir = path.join('visual_regression', 'baseline');
    const currentDir = path.join('visual_regression', 'current');
    const diffDir = path.join('visual_regression', 'diff');

    [currentDir, baselineDir, diffDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    const baselinePath = path.join(baselineDir, imageName + '.png');
    const currentPath = path.join(currentDir, imageName + '.png');
    const diffPath = path.join(diffDir, imageName + '.png');

    const screenshot = await driver.takeScreenshot();
    const imgBuffer = Buffer.from(screenshot, 'base64');
    fs.writeFileSync(currentPath, imgBuffer);

    if (!fs.existsSync(baselinePath)) {
        fs.copyFileSync(currentPath, baselinePath);
        return;
    }

    const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
    const img2 = PNG.sync.read(fs.readFileSync(currentPath));

    if (img1.width !== img2.width || img1.height !== img2.height) {
        throw new Error('Image dimensions do not match.');
    }

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
    );

    const totalPixels = width * height;
    const diffPercent = (numDiffPixels / totalPixels) * 100;

    console.log(`Different pixels: ${numDiffPixels}`);
    console.log(`Difference percentage: ${diffPercent.toFixed(2)}%`);

    if (diffPercent > maxDiffPercent) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        
        throw new Error(
            `Visual regression detected! Difference ${diffPercent.toFixed(2)}% exceeds ${maxDiffPercent}% threshold.`
        );
    } else {
        console.log('Visual comparison passed.');
    }
}

module.exports = { compareScreenshot };