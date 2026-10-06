// ========================================
// TARİHATLAS
// ========================================


// ========================================
// HARİTA
// ========================================

const harita = L.map("harita", {
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true
}).setView([39, 35], 5);


// ========================================
// MAPLIBRE / OPENFREEMAP
// ========================================

const mapStyle =
    "https://tiles.openfreemap.org/styles/liberty";

L.maplibreGL({
    style: mapStyle
}).addTo(harita);


// ========================================
// ZOOM AYARLARI
// ========================================

harita.setMinZoom(3);
harita.setMaxZoom(18);


// ========================================
// HTML ELEMANLARI
// ========================================

const timeline =
    document.getElementById("timeline");

const yearDisplay =
    document.getElementById("year");

const eventInfo =
    document.getElementById("eventInfo");

const nextWarBtn =
    document.getElementById("nextWarBtn");


// ========================================
// DEĞİŞKENLER
// ========================================

let activeMarker = null;
let eventAnimation = null;
let currentEventIndex = 0;


// ========================================
// TARİHSEL OLAYLAR
// ========================================

const events = [

    {
        year: 1071,
        type: "war",
        text: "⚔️ Malazgirt Savaşı",
        description:
            "Büyük Selçuklu Sultanı Alp Arslan ile Bizans İmparatoru Romanos Diogenes arasında gerçekleşti.",
        lat: 39.15,
        lng: 42.54
    },

    {
        year: 1097,
        type: "war",
        text: "⚔️ I. Haçlı Seferi",
        description:
            "Haçlı ordularının Anadolu üzerinden ilerlediği dönem.",
        lat: 40.43,
        lng: 29.72
    },

    {
        year: 1176,
        type: "war",
        text: "⚔️ Miryokefalon Savaşı",
        description:
            "Anadolu Selçukluları ile Bizans İmparatorluğu arasında gerçekleşti.",
        lat: 38.12,
        lng: 29.77
    },

    {
        year: 1243,
        type: "war",
        text: "⚔️ Kösedağ Savaşı",
        description:
            "Anadolu Selçuklu Devleti ile Moğol kuvvetleri arasında gerçekleşti.",
        lat: 39.80,
        lng: 36.30
    },

    {
        year: 1299,
        type: "event",
        text: "🏹 Osmanlı Beyliği'nin kuruluş dönemi",
        description:
            "Osmanlı Beyliği'nin Anadolu'daki yükselişinin başlangıç dönemi.",
        lat: 40.14,
        lng: 30.15
    },

    {
        year: 1302,
        type: "war",
        text: "⚔️ Bapheus Savaşı",
        description:
            "Osmanlı Beyliği ile Bizans kuvvetleri arasında gerçekleşti.",
        lat: 40.70,
        lng: 29.60
    },

    {
        year: 1389,
        type: "war",
        text: "⚔️ I. Kosova Savaşı",
        description:
            "Osmanlı ordusu ile Balkan kuvvetleri arasında gerçekleşti.",
        lat: 42.64,
        lng: 21.10
    },

    {
        year: 1402,
        type: "war",
        text: "⚔️ Ankara Savaşı",
        description:
            "Timur ile Osmanlı Sultanı I. Bayezid arasında gerçekleşti.",
        lat: 39.93,
        lng: 32.85
    },

    {
        year: 1444,
        type: "war",
        text: "⚔️ Varna Savaşı",
        description:
            "Osmanlı ordusu ile Haçlı kuvvetleri arasında gerçekleşti.",
        lat: 43.21,
        lng: 27.91
    },

    {
        year: 1453,
        type: "event",
        text: "🏛️ İstanbul'un Fethi",
        description:
            "Fatih Sultan Mehmet'in komutasındaki Osmanlı ordusu İstanbul'u fethetti.",
        lat: 41.0082,
        lng: 28.9784
    },

    {
        year: 1473,
        type: "war",
        text: "⚔️ Otlukbeli Savaşı",
        description:
            "Osmanlı Devleti ile Akkoyunlu Devleti arasında gerçekleşti.",
        lat: 39.92,
        lng: 40.00
    },

    {
        year: 1514,
        type: "war",
        text: "⚔️ Çaldıran Savaşı",
        description:
            "Osmanlı Devleti ile Safevî Devleti arasında gerçekleşti.",
        lat: 38.99,
        lng: 43.99
    },

    {
        year: 1517,
        type: "war",
        text: "⚔️ Mısır Seferi",
        description:
            "Yavuz Sultan Selim döneminde Osmanlı ordusu Mısır'da Memlük Devleti'ne karşı sefer düzenledi.",
        lat: 30.04,
        lng: 31.24
    },

    {
        year: 1526,
        type: "war",
        text: "⚔️ Mohaç Meydan Muharebesi",
        description:
            "Osmanlı ordusu ile Macar Krallığı arasında gerçekleşti.",
        lat: 45.95,
        lng: 18.68
    },

    {
        year: 1529,
        type: "war",
        text: "⚔️ I. Viyana Kuşatması",
        description:
            "Kanuni Sultan Süleyman döneminde Osmanlı ordusu Viyana'yı kuşattı.",
        lat: 48.21,
        lng: 16.37
    },

    {
        year: 1571,
        type: "war",
        text: "⚔️ Kıbrıs'ın Fethi",
        description:
            "Osmanlı kuvvetlerinin Kıbrıs seferi.",
        lat: 35.13,
        lng: 33.43
    },

    {
        year: 1683,
        type: "war",
        text: "⚔️ II. Viyana Kuşatması",
        description:
            "Osmanlı ordusunun Viyana'yı ikinci kez kuşatması.",
        lat: 48.21,
        lng: 16.37
    },

    {
        year: 1699,
        type: "event",
        text: "📜 Karlofça Antlaşması",
        description:
            "Osmanlı Devleti ile Kutsal İttifak devletleri arasında imzalandı.",
        lat: 45.26,
        lng: 19.83
    },

    {
        year: 1711,
        type: "war",
        text: "⚔️ Prut Savaşı",
        description:
            "Osmanlı ordusu ile Rusya arasında gerçekleşti.",
        lat: 46.95,
        lng: 28.25
    },

    {
        year: 1774,
        type: "event",
        text: "📜 Küçük Kaynarca Antlaşması",
        description:
            "Osmanlı-Rus Savaşı'nın ardından imzalandı.",
        lat: 45.33,
        lng: 28.40
    },

    {
        year: 1821,
        type: "war",
        text: "⚔️ Yunan İsyanı",
        description:
            "Osmanlı yönetimine karşı başlayan Yunan bağımsızlık hareketi.",
        lat: 37.98,
        lng: 23.72
    },

    {
        year: 1853,
        type: "war",
        text: "⚔️ Kırım Savaşı",
        description:
            "Osmanlı Devleti ile Rusya arasında gerçekleşen savaş.",
        lat: 44.95,
        lng: 34.10
    },

    {
        year: 1877,
        type: "war",
        text: "⚔️ 93 Harbi",
        description:
            "Osmanlı Devleti ile Rusya arasında gerçekleşen 1877–1878 savaşı.",
        lat: 43.21,
        lng: 27.91
    },

    {
        year: 1912,
        type: "war",
        text: "⚔️ Balkan Savaşları",
        description:
            "Osmanlı Devleti'nin Balkan devletleriyle yaptığı savaşlar.",
        lat: 41.00,
        lng: 21.00
    },

    {
        year: 1914,
        type: "war",
        text: "⚔️ I. Dünya Savaşı",
        description:
            "Osmanlı Devleti'nin de dahil olduğu küresel savaş başladı.",
        lat: 40.00,
        lng: 35.00
    },

    {
        year: 1915,
        type: "war",
        text: "⚔️ Çanakkale Savaşları",
        description:
            "İtilaf Devletlerinin Çanakkale ve Gelibolu'ya yönelik harekâtı.",
        lat: 40.15,
        lng: 26.40
    },

    {
        year: 1916,
        type: "war",
        text: "⚔️ Kut'ül Amare",
        description:
            "Osmanlı kuvvetlerinin Irak Cephesi'nde İngiliz kuvvetlerine karşı kazandığı muharebe.",
        lat: 32.50,
        lng: 45.80
    },

    {
        year: 1918,
        type: "event",
        text: "📜 Mondros Ateşkes Antlaşması",
        description:
            "Osmanlı Devleti ile İtilaf Devletleri arasında imzalanan ateşkes.",
        lat: 40.10,
        lng: 25.70
    },

    {
        year: 1919,
        type: "event",
        text: "🇹🇷 Millî Mücadele'nin başlangıcı",
        description:
            "Mustafa Kemal Paşa'nın Samsun'a çıkışıyla Millî Mücadele dönemi başladı.",
        lat: 41.29,
        lng: 36.33
    },

    {
        year: 1920,
        type: "event",
        text: "📜 Sevr Antlaşması",
        description:
            "Osmanlı Devleti ile İtilaf Devletleri arasında imzalandı.",
        lat: 48.85,
        lng: 2.35
    },

    {
        year: 1921,
        type: "war",
        text: "⚔️ Sakarya Meydan Muharebesi",
        description:
            "Türk ordusu ile Yunan kuvvetleri arasında gerçekleşti.",
        lat: 39.65,
        lng: 32.35
    },

    {
        year: 1922,
        type: "war",
        text: "⚔️ Büyük Taarruz",
        description:
            "Türk ordusunun Yunan kuvvetlerine karşı gerçekleştirdiği büyük askerî harekât.",
        lat: 38.76,
        lng: 30.54
    },

    {
        year: 1923,
        type: "event",
        text: "🇹🇷 Cumhuriyet'in ilanı",
        description:
            "Türkiye Cumhuriyeti 29 Ekim 1923 tarihinde ilan edildi.",
        lat: 39.9334,
        lng: 32.8597
    }

];


// ========================================
// SÜRGÜ AYARLARI
// ========================================

timeline.min = 0;
timeline.max = events.length - 1;
timeline.step = 1;
timeline.value = 0;


// ========================================
// MARKER ANİMASYONU
// ========================================

function animateEvent(marker) {

    if (eventAnimation !== null) {
        clearInterval(eventAnimation);
        eventAnimation = null;
    }

    let visible = true;
    let count = 0;

    eventAnimation = setInterval(function () {

        if (!marker) {
            clearInterval(eventAnimation);
            eventAnimation = null;
            return;
        }

        visible = !visible;

        marker.setOpacity(
            visible ? 1 : 0.25
        );

        count++;

        if (count >= 30) {

            clearInterval(eventAnimation);
            eventAnimation = null;

            marker.setOpacity(1);
        }

    }, 100);
}


// ========================================
// OLAYI GÖSTER
// ========================================

function showEvent(index) {

    const event = events[index];

    if (!event) {
        return;
    }

    currentEventIndex = index;

    // YIL

    yearDisplay.textContent = event.year;


    // BİLGİ

    eventInfo.innerHTML = `
        <strong>${event.text}</strong>
        <br>
        <span>${event.description}</span>
    `;


    // ESKİ MARKER

    if (activeMarker !== null) {

        harita.removeLayer(activeMarker);

        activeMarker = null;
    }


    // YENİ MARKER

    activeMarker = L.marker([
        event.lat,
        event.lng
    ]).addTo(harita);


    // POPUP

    activeMarker.bindPopup(`
        <div style="
            min-width:230px;
            max-width:300px;
        ">

            <h3 style="
                margin:0 0 10px 0;
            ">
                ${event.text}
            </h3>

            <p style="
                margin:0;
                line-height:1.5;
            ">
                ${event.description}
            </p>

        </div>
    `);


    // ========================================
    // ZOOM
    // ========================================

    harita.flyTo(
        [event.lat, event.lng],
        8,
        {
            animate: true,
            duration: 2,
            easeLinearity: 0.25
        }
    );


    // ========================================
    // MARKER ANİMASYONU
    // ========================================

    animateEvent(activeMarker);


    // ========================================
    // POPUP
    // ========================================

    setTimeout(function () {

        if (activeMarker !== null) {
            activeMarker.openPopup();
        }

    }, 2000);
}


// ========================================
// SONRAKİ SAVAŞ
// ========================================

function goToNextWar() {

    let nextWarIndex = -1;


    // Sonraki savaşı ara

    for (
        let i = currentEventIndex + 1;
        i < events.length;
        i++
    ) {

        if (events[i].type === "war") {

            nextWarIndex = i;

            break;
        }
    }


    // Son savaştan sonra ilk savaşa dön

    if (nextWarIndex === -1) {

        for (
            let i = 0;
            i < events.length;
            i++
        ) {

            if (events[i].type === "war") {

                nextWarIndex = i;

                break;
            }
        }
    }


    // Savaşa git

    if (nextWarIndex !== -1) {

        timeline.value = nextWarIndex;

        showEvent(nextWarIndex);
    }
}


// ========================================
// SÜRGÜ
// ========================================

timeline.addEventListener(
    "input",
    function () {

        const index =
            Number(timeline.value);

        showEvent(index);

    }
);


// ========================================
// SONRAKİ SAVAŞ BUTONU
// ========================================

if (nextWarBtn) {

    nextWarBtn.addEventListener(
        "click",
        goToNextWar
    );
}


// ========================================
// BAŞLANGIÇ
// ========================================

showEvent(0);


// ========================================
// HARİTA BOYUTU
// ========================================

setTimeout(function () {

    harita.invalidateSize();

}, 500);