document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionControls = document.getElementById('compressionControls');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalImage) {
            compressImage(originalImage);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                // 显示原始图片
                originalPreview.src = originalImage.src;
                originalSize.textContent = formatFileSize(file.size);
                
                // 压缩图片
                compressImage(originalImage);
                
                // 显示控制和预览区域
                compressionControls.style.display = 'block';
                previewArea.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.drawImage(image, 0, 0);
        
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后文件大小
        const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const compressedFileSizeBytes = base64Length * 0.75;
        compressedSize.textContent = formatFileSize(compressedFileSizeBytes);
        
        // 更新下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed_image.jpg';
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    }
}); 