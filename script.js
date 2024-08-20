const wrapper = document.querySelector(".wrapper"),
    form = wrapper.querySelector(".form"),
    input = form.querySelector(".form__input"),
    advancedFeatures = form.querySelector(".advanced-features__wrapper"),
    advancedFeaturesLabelSwitch = advancedFeatures.querySelector(".advanced-features__label-switch"),
    advancedFeaturesSwitch = advancedFeatures.querySelector(".advanced-features__switch"),
    advancedFeaturesInner = advancedFeatures.querySelector(".advanced-features"),
    advancedFeaturesFormat = advancedFeatures.querySelector(".advanced-features__format"),
    advancedFeaturesSize = advancedFeatures.querySelector(".advanced-features__size"),
    advancedFeaturesECC = advancedFeatures.querySelector(".advanced-features__ecc"),
    advancedFeaturesColor1 = advancedFeatures.querySelector(".af-color1"),
    advancedFeaturesColor2 = advancedFeatures.querySelector(".af-color2"),
    advancedFeaturesColor3 = advancedFeatures.querySelector(".af-color3"),
    advancedFeaturesBGColor1 = advancedFeatures.querySelector(".af-bg-color1"),
    advancedFeaturesBGColor2 = advancedFeatures.querySelector(".af-bg-color2"),
    advancedFeaturesBGColor3 = advancedFeatures.querySelector(".af-bg-color3"),
    qrCodeWrapper = wrapper.querySelector(".qr-code"),
    qrCode = wrapper.querySelector(".qr-code img"),
    button = form.querySelector(".button"),
    buttons = wrapper.querySelector(".buttons"),
    buttonCopy = buttons.querySelector(".button-copy"),
    buttonShare = buttons.querySelector(".button-share"),
    shareWrapper = wrapper.querySelector(".share-wrapper"),
    share = wrapper.querySelector(".share"),
    shareTelegram = share.querySelector(".share__telegram"),
    shareVk = share.querySelector(".share__vk"),
    shareOk = share.querySelector(".share__ok"),
    shareWhatsapp = share.querySelector(".share__whatsapp"),
    shareMail = share.querySelector(".share__mail"),
    shareClose = share.querySelector(".share__close");


let currentValueInput;
let currentValueFormat;
let currentValueSize;
let currentValueECC;
let currentValueColor1;
let currentValueColor2;
let currentValueColor3;
let currentValueBGColor1;
let currentValueBGColor2;
let currentValueBGColor3;
let counter = 0;
let num = 0;


function counter7() {
    if (counter == 7) {
        alert("Время ожидания завышено, генерация остановлена");
        location.reload();
    }
}

function waitingGenerationQR() {
    counter += 1;

    setTimeout(() => {
        if (num == 2) {
            button.textContent = "Сгенерировать QR-код";
            num = 0;
            return;
        }
        button.textContent = "Идёт создание QR-кода."

        setTimeout(() => {
            if (num == 2) {
                button.textContent = "Сгенерировать QR-код";
                num = 0;
                return;
            }
            button.textContent = "Идёт создание QR-кода.."

            setTimeout(() => {
                if (num == 2) {
                    button.textContent = "Сгенерировать QR-код";
                    num = 0;
                    return;
                }
                button.textContent = "Идёт создание QR-кода...",
                counter7(), waitingGenerationQR();
            }, 500);
        }, 500);
    }, 500);
}


advancedFeaturesSwitch.addEventListener("change", function() {
    if (advancedFeaturesSwitch.checked) {
        advancedFeaturesInner.style.display = "flex";
    } else {
        advancedFeaturesInner.style.display = "none";
    }
});

input.addEventListener("input", function() {
    if (this.value.trim()) {
        advancedFeatures.style.display = "flex";
    }
});



form.addEventListener("submit", (event) => {
    event.preventDefault();


    let inputValue = input.value.trim().replace(/\s+/g, "%2B").replace(/(#)/g, "%23").replace(/(\+)/g, "%2B").replace(/(")/g, "%27");
    let format = advancedFeaturesFormat.value.trim();
    let size = advancedFeaturesSize.value.trim();
    if (size == "") {size = 250}
    let ecc = advancedFeaturesECC.value.trim();

    let color1 = advancedFeaturesColor1.value.trim();
    let color2 = advancedFeaturesColor2.value.trim();
    let color3 = advancedFeaturesColor3.value.trim();
    
    let bgcolor1 = advancedFeaturesBGColor1.value.trim();
    let bgcolor2 = advancedFeaturesBGColor2.value.trim();
    let bgcolor3 = advancedFeaturesBGColor3.value.trim();

    if (
        (inputValue == currentValueInput)
        & (!format || format == currentValueFormat) & (!size || size == currentValueSize) & (!ecc || ecc == currentValueECC)
        & (!color1 || color1 == currentValueColor1) & (!color2 || color2 == currentValueColor2) & (!color3 || color3 == currentValueColor3)
        & (!bgcolor1 || bgcolor1 == currentValueBGColor1) & (!bgcolor2 || bgcolor2 == currentValueBGColor2) & (!bgcolor3 || bgcolor3 == currentValueBGColor3)
    ) return;
    
    currentValueInput = inputValue;

    currentValueFormat = format;
    currentValueSize = size;
    currentValueECC = ecc;

    if (color1 == "") {color1 = 0}
    if (color2 == "") {color2 = 0}
    if (color3 == "") {color3 = 0}
    currentValueColor1 = color1;
    currentValueColor2 = color2;
    currentValueColor3 = color3;

    if (bgcolor1 == "") {bgcolor1 = 255}
    if (bgcolor2 == "") {bgcolor2 = 255}
    if (bgcolor3 == "") {bgcolor3 = 255}
    currentValueBGColor1 = bgcolor1;
    currentValueBGColor2 = bgcolor2;
    currentValueBGColor3 = bgcolor3;


    waitingGenerationQR();
    qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?data=${inputValue}&format=${format}&size=${size}x${size}&ecc=${ecc}&color=${color1}-${color2}-${color3}&bgcolor=${bgcolor1}-${bgcolor2}-${bgcolor3}`;

    qrCode.addEventListener("error", () => {
        num = 2;
        alert("Ошибка при загрузке QR-кода.");
        location.reload();
    });

    qrCode.addEventListener("load", () => {
        num = 2;
        qrCodeWrapper.style.display = "flex";
        qrCode.style.display = "initial";
        buttons.style.display = "flex";
        wrapper.classList.add("active");
        button.textContent = "Сгенерировать QR-код";
    });

    input.addEventListener("input", function() {
        if (!this.value.trim() && wrapper.classList.contains("active")) {
            wrapper.classList.remove("active");
            qrCodeWrapper.style.display = "none";
            buttons.style.display = "none";
        }
    });

    buttonCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(qrCode.src);

        buttonCopy.textContent = "Скопировано!";
        setTimeout(() => {
            buttonCopy.textContent = "Копировать ссылку на QR-код";
        }, 2000);
    });


    buttonShare.addEventListener("click", function() {
        share.style.display = "flex";
        shareWrapper.style.display = "initial";
    });

    document.addEventListener("mouseup", function(e) {
        if (!share.contains(e.target) & share.style.display == "flex" & shareWrapper.style.display == "initial") {
            share.style.display = "none";
            shareWrapper.style.display = "none";
        }
    });
    
    let qrCodeSrc = qrCode.src.replace(/(&)/g, "%26");
    shareTelegram.href = `https://t.me/share/url?url=${qrCodeSrc}`;
    shareVk.href = `https://vk.com/share.php?url=${qrCodeSrc}&title=qr-код`;
    shareOk.href = `https://connect.ok.ru/offer?url=${qrCodeSrc}&title=qr-код`;
    shareWhatsapp.href = `https://api.whatsapp.com/send?text=${qrCodeSrc}`;
    shareMail.href = `mailto:mail.com&body=${qrCodeSrc}`;

    shareClose.addEventListener("click", () => {
        share.style.display = "none";
        shareWrapper.style.display = "none";
    })
});