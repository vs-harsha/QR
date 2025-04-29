document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('text-input');
    const imageInput = document.getElementById('image-input');
    const generateTextBtn = document.getElementById('generate-text-btn');
    const generateImageBtn = document.getElementById('generate-image-btn');
    const loading = document.getElementById('loading');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('close-modal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const scannedText = document.getElementById('scanned-text');
    const scannedImage = document.getElementById('scanned-image');
    const imageLabel = document.getElementById('image-label');

    function openModal() {
      modal.classList.add('active');
    }

    function closeModal() {
      modal.classList.remove('active');
    }

    generateTextBtn.addEventListener('click', function () {
      const text = textInput.value.trim();
      if (!text) {
        alert('Please enter some text first');
        return;
      }
      loading.style.display = 'block';
      qrcodeContainer.innerHTML = '';
      scannedText.textContent = '';
      scannedImage.style.display = 'none';
      imageLabel.style.display = 'none';

      setTimeout(() => {
        new QRCode(qrcodeContainer, {
          text: text,
          width: 200,
          height: 200,
          colorDark: "#2d3748",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        scannedText.textContent = text;
        scannedText.style.fontSize = '1.8rem';
        loading.style.display = 'none';
        openModal();
      }, 300);
    });

    generateImageBtn.addEventListener('click', function () {
      const file = imageInput.files[0];
      if (!file) {
        alert('Please select an image first');
        return;
      }
      if (file.size > 1024 * 1024) {
        alert('Please select an image smaller than 1MB');
        return;
      }
      loading.style.display = 'block';
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

          // Clear old
          qrcodeContainer.innerHTML = '';
          scannedText.textContent = '';

          // Instead of embedding image, use a fixed short URL for QR
          const imageQRText = "Scanned Image"; // You could change this to an actual image URL from server
          new QRCode(qrcodeContainer, {
            text: imageQRText,
            width: 200,
            height: 200,
            colorDark: "#2d3748",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L
          });

          scannedImage.src = imageDataUrl;
          scannedImage.style.display = 'block';
          imageLabel.style.display = 'block';
          loading.style.display = 'none';
          openModal();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    closeModalBtn.addEventListener('click', closeModal);
  });