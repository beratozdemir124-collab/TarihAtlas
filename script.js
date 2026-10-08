// ========================================
// TARİHATLAS
// ========================================

const harita = L.map("harita", {
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true,
    tap: true
}).setView([39, 35], 5);

const mapStyle = "https://tiles.openfreemap.org/styles/liberty";

L.maplibreGL({
    style: mapStyle
}).addTo(harita);

harita.setMinZoom(3);
harita.setMaxZoom(18);

// ========================================
// ÖZEL RENKLİ MARKER SİSTEMİ
// ========================================

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// ========================================
// HTML ELEMANLARI
// ========================================

const timeline = document.getElementById("timeline");
const eventInfo = document.getElementById("eventInfo");
const nextWarBtn = document.getElementById("nextWarBtn");
const topBar = document.querySelector(".top-bar");

let activeMarker = null;
let eventAnimation = null;
let currentEventIndex = 0;

// ========================================
// BAYRAK LİNKLERİ
// ========================================

const flags = {
    seljuk: "https://flagcdn.com/w160/tr.png",
    byz: "https://flagcdn.com/w160/gr.png",
    crusader: "https://flagcdn.com/w160/va.png",
    mongol: "https://flagcdn.com/w160/mn.png",
    otto_early: "https://flagcdn.com/w160/tr.png",
    otto: "https://flagcdn.com/w160/tr.png",
    otto_late: "https://flagcdn.com/w160/tr.png",
    serbia: "https://flagcdn.com/w160/rs.png",
    bulgaria: "https://flagcdn.com/w160/bg.png",
    timur: "https://flagcdn.com/w160/uz.png",
    hungary: "https://flagcdn.com/w160/hu.png",
    aq: "https://flagcdn.com/w160/az.png",
    safavid: "https://flagcdn.com/w160/ir.png",
    mamluk: "https://flagcdn.com/w160/eg.png",
    habsburg: "https://flagcdn.com/w160/at.png",
    venice: "https://flagcdn.com/w160/it.png",
    russia: "https://flagcdn.com/w160/ru.png",
    greece: "https://flagcdn.com/w160/gr.png",
    uk: "https://flagcdn.com/w160/gb.png",
    france: "https://flagcdn.com/w160/fr.png",
    turkey: "https://flagcdn.com/w160/tr.png",
    un: "https://flagcdn.com/w160/un.png",
    cyprus: "https://flagcdn.com/w160/cy.png",
    syria: "https://flagcdn.com/w160/sy.png",
    china: "https://flagcdn.com/w160/cn.png"
};

// Not: flag1 kazanan/tarafımız, flag2 ise kaybeden/rakip taraf olarak düzenlenmiştir.
const events = [
    {
        year: 1071, type: "war", text: "⚔️ Malazgirt Savaşı",
        description: "Sultan Alp Arslan, Turan taktiğiyle İmparator Romanos Diogenes komutasındaki Bizans ordusunu mağlup ederek Anadolu'nun kapılarını Türklere kesin olarak açtı.",
        leader: "Sultan Alp Arslan", flag1: flags.seljuk, flag2: flags.byz, lat: 39.15, lng: 42.54
    },
    {
        year: 1097, type: "war", text: "⚔️ I. Haçlı Seferi ve İznik Kuşatması",
        description: "Haçlı orduları Selçuklu başkenti İznik'i ele geçirdi. I. Kılıç Arslan yıpratma ve pusu taktikleriyle Haçlı ilerleyişini yavaşlatmayı başardı.",
        leader: "I. Kılıç Arslan", flag1: flags.seljuk, flag2: flags.crusader, lat: 40.43, lng: 29.72
    },
    {
        year: 1176, type: "war", text: "⚔️ Miryokefalon Savaşı",
        description: "II. Kılıç Arslan, Bizans İmparatoru I. Manuel Komnenos'un ordusunu pusuya düşürdü. Bu zaferle Anadolu'nun Türk yurdu olduğu kesinleşti.",
        leader: "II. Kılıç Arslan", flag1: flags.seljuk, flag2: flags.byz, lat: 38.12, lng: 29.77
    },
    {
        year: 1243, type: "war", text: "⚔️ Kösedağ Savaşı",
        description: "Moğol İlhanlı ordusuna ağır bir şekilde yenilen Anadolu Selçuklu Devleti ilhanlı tabiyetine girdi ve Anadolu'da II. Beylikler Dönemi başladı.",
        leader: "II. Gıyaseddin Keyhüsrev", flag1: flags.mongol, flag2: flags.seljuk, lat: 39.80, lng: 36.30
    },
    {
        year: 1299, type: "event", text: "🏹 Osmanlı Devleti'nin Kuruluşu",
        description: "Osman Gazi liderliğinde Söğüt ve Domaniç çevresinde bağımsız Osmanlı Beyliği kuruldu ve cihan devletinin ilk temelleri atıldı.",
        leader: "Osman Gazi", flag1: flags.otto_early, flag2: null, lat: 40.14, lng: 30.15
    },
    {
        year: 1302, type: "war", text: "⚔️ Bapheus (Koyunhisar) Savaşı",
        description: "Osmanlı Beyliği ile Bizans İmparatorluğu arasındaki ilk meydan savaşı kazanıldı; beyliğin bağımsızlığı ve prestiji bölgede pekişti.",
        leader: "Osman Gazi", flag1: flags.otto_early, flag2: flags.byz, lat: 40.70, lng: 29.60
    },
    {
        year: 1389, type: "war", text: "⚔️ I. Kosova Savaşı",
        description: "Balkan Hristiyan ittifakı mağlup edildi. Büyük zaferin ardından Sultan I. Murad, yaralı Sırp soylusu Miloş Obiliç tarafından şehit edildi.",
        leader: "Sultan I. Murad", flag1: flags.otto_early, flag2: flags.serbia, lat: 42.64, lng: 21.10
    },
    {
        year: 1402, type: "war", text: "⚔️ Ankara Savaşı",
        description: "Timur, Yıldırım Bayezid komutasındaki Osmanlı ordusunu mağlup etti. Osmanlı Devleti 11 yıl sürecek olan Fetret Devri'ne girdi.",
        leader: "Yıldırım Bayezid & Timur", flag1: flags.timur, flag2: flags.otto_early, lat: 39.93, lng: 32.85
    },
    {
        year: 1444, type: "war", text: "⚔️ Varna Savaşı",
        description: "Sultan II. Murad komutasındaki Osmanlı ordusu, Haçlı kuvvetlerini bozguna uğratarak Balkanlar'daki Türk hakimiyetini teminat altına aldı.",
        leader: "Sultan II. Murad", flag1: flags.otto, flag2: flags.hungary, lat: 43.21, lng: 27.91
    },
    {
        year: 1453, type: "event", text: "🏛️ İstanbul'un Fethi",
        description: "II. Mehmed, 53 günlük kuşatmanın ardından İstanbul'u fethederek Bin yıllık Bizans'a son verdi, Çağ kapattı ve 'Fatih' unvanını aldı.",
        leader: "Fatih Sultan Mehmed", flag1: flags.otto, flag2: flags.byz, lat: 41.0082, lng: 28.9784
    },
    {
        year: 1473, type: "war", text: "⚔️ Otlukbeli Savaşı",
        description: "Akkoyunlu Hükümdarı Uzun Hasan mağlup edildi. Ateşli silahların üstünlüğüyle Doğu Anadolu bölgesi Osmanlı denetimine geçti.",
        leader: "Fatih Sultan Mehmed", flag1: flags.otto, flag2: flags.aq, lat: 39.92, lng: 40.00
    },
    {
        year: 1514, type: "war", text: "⚔️ Çaldıran Savaşı",
        description: "Yavuz Sultan Selim, Safevî Şahı İsmail'i mağlup ederek Doğu ve Güneydoğu Anadolu sınırlarının güvenliğini kesinleştirdi.",
        leader: "Yavuz Sultan Selim", flag1: flags.otto, flag2: flags.safavid, lat: 38.99, lng: 43.99
    },
    {
        year: 1517, type: "war", text: "⚔️ Ridaniye Savaşı (Mısır Seferi)",
        description: "Memlük Devleti tamamen yıkıldı, Mısır ve Hicaz Osmanlı topraklarına katıldı; Halifelik makamı Osmanlı Hanedanı'na geçti.",
        leader: "Yavuz Sultan Selim", flag1: flags.otto, flag2: flags.mamluk, lat: 30.04, lng: 31.24
    },
    {
        year: 1526, type: "war", text: "⚔️ Mohaç Meydan Muharebesi",
        description: "Kanuni Sultan Süleyman 2 saat gibi kısa bir sürede Macar ordusunu imha etti; Macaristan Krallığı Osmanlı kontrolüne girdi.",
        leader: "Kanuni Sultan Süleyman", flag1: flags.otto, flag2: flags.hungary, lat: 45.95, lng: 18.68
    },
    {
        year: 1529, type: "war", text: "⚔️ I. Viyana Kuşatması",
        description: "Ağır kış şartları ve lojistik zorluklar nedeniyle kale düşürülemedi ancak Osmanlı askerî gücü Orta Avrupa'nın kalbine kadar ulaştı.",
        leader: "Kanuni Sultan Süleyman", flag1: flags.otto, flag2: flags.habsburg, lat: 48.21, lng: 16.37
    },
    {
        year: 1571, type: "war", text: "⚔️ Kıbrıs'ın Fethi",
        description: "Doğu Akdeniz ticaret yollarının güvenliğini sağlamak amacıyla stratejik öneme sahip Kıbrıs adası Venedik'ten fethedildi.",
        leader: "Lala Mustafa Paşa", flag1: flags.otto, flag2: flags.venice, lat: 35.13, lng: 33.43
    },
    {
        year: 1683, type: "war", text: "⚔️ II. Viyana Kuşatması",
        description: "Lehistan ordusunun arkadan saldırmasıyla Osmanlı ordusu ağır bir yenilgi aldı; Kutsal İttifak Savaşları ve uzun gerileme dönemi başladı.",
        leader: "Merzifonlu Kara Mustafa Paşa", flag1: flags.habsburg, flag2: flags.otto, lat: 48.21, lng: 16.37
    },
    {
        year: 1699, type: "diplomacy", text: "📜 Karlofça Antlaşması",
        description: "Osmanlı Devleti Batı'da ilk kez büyük çapta toprak kaybetti; devlet politikalarında savunma ve Gerileme Dönemi resmiyet kazandı.",
        leader: "II. Mustafa / Rami Mehmed Efendi", flag1: flags.habsburg, flag2: flags.otto, lat: 45.26, lng: 19.83
    },
    {
        year: 1711, type: "war", text: "⚔️ Prut Savaşı",
        description: "Rus Çarı I. Petro kuşatıldı; imzalanan antlaşmayla Karlofça'da kaybedilen Azak Kalesi Osmanlı tarafından geri alındı.",
        leader: "Baltacı Mehmet Paşa", flag1: flags.otto, flag2: flags.russia, lat: 46.95, lng: 28.25
    },
    {
        year: 1774, type: "diplomacy", text: "📜 Küçük Kaynarca Antlaşması",
        description: "Kırım müstakil oldu. Rusya Karadeniz'de donanma bulundurma ve Osmanlı Ortodokslarını koruma hakkı elde ederek büyük güç kazandı.",
        leader: "I. Abdülhamid", flag1: flags.russia, flag2: flags.otto, lat: 45.33, lng: 28.40
    },
    {
        year: 1821, type: "war", text: "⚔️ Yunan İsyanı",
        description: "Avrupa devletlerinin açık desteğiyle başlayan isyan, 1829 Edirne Antlaşması ile bağımsız Yunanistan'ın kurulmasıyla sonuçlandı.",
        leader: "II. Mahmud", flag1: flags.greece, flag2: flags.otto_late, lat: 37.98, lng: 23.72
    },
    {
        year: 1853, type: "war", text: "⚔️ Kırım Savaşı",
        description: "İngiltere ve Fransa ile müttefik olan Osmanlı Devleti Rusya'yı mağlup etti; savaş masrafları için tarihte ilk kez dış borç alındı.",
        leader: "Sultan Abdülmecid", flag1: flags.otto_late, flag2: flags.russia, lat: 44.95, lng: 34.10
    },
    {
        year: 1877, type: "war", text: "⚔️ 93 Harbi (1877-1878 Osmanlı-Rus Savaşı)",
        description: "Plevne ve Erzurum savunmalarına rağmen Rusya galip geldi; Berlin Antlaşması'yla Balkanlar'da büyük toprak kayıpları yaşandı.",
        leader: "Gazi Osman Paşa", flag1: flags.russia, flag2: flags.otto_late, lat: 43.21, lng: 27.91
    },
    {
        year: 1912, type: "war", text: "⚔️ Balkan Savaşları",
        description: "I. Balkan Savaşı'nda Edirne ve Rumeli kaybedildi. II. Balkan Savaşı'nda Enver Paşa komutasındaki birlikler Edirne'yi geri aldı.",
        leader: "Enver Paşa", flag1: flags.bulgaria, flag2: flags.otto_late, lat: 41.00, lng: 21.00
    },
    {
        year: 1914, type: "war", text: "⚔️ I. Dünya Savaşı'nın Başlaması",
        description: "Osmanlı Devleti İttifak Devletleri safında savaşa girdi; Çanakkale, Kafkasya, Kanal ve Irak dâhil birçok cephede mücadele etti.",
        leader: "Enver Paşa", flag1: flags.uk, flag2: flags.otto_late, lat: 40.00, lng: 35.00
    },
    {
        year: 1915, type: "war", text: "⚔️ Çanakkale Savaşları",
        description: "Mustafa Kemal Paşa ve Türk ordusu, deniz ve karada İtilaf Devletleri'ne geçit vermeyerek tarihe geçen 'Çanakkale Geçilmez' zaferini yazdı.",
        leader: "Mustafa Kemal Paşa", flag1: flags.otto_late, flag2: flags.uk, lat: 40.15, lng: 26.40
    },
    {
        year: 1916, type: "war", text: "⚔️ Kut'ül Amare Zaferi",
        description: "Irak Cephesi'nde Halil Paşa komutasındaki Osmanlı birlikleri, General Townshend ve tüm İngiliz ordusunu esir alarak büyük bir zafer kazandı.",
        leader: "Halil Kut Paşa", flag1: flags.otto_late, flag2: flags.uk, lat: 32.50, lng: 45.80
    },
    {
        year: 1918, type: "diplomacy", text: "📜 Mondros Ateşkes Antlaşması",
        description: "Ağır maddeler içeren ateşkesle İtilaf Devletleri Anadolu'yu yer yer işgale başladı ve Osmanlı Devleti fiilen sona erdi.",
        leader: "Rauf Orbay", flag1: flags.uk, flag2: flags.otto_late, lat: 40.10, lng: 25.70
    },
    {
        year: 1919, type: "event", text: "🇹🇷 Millî Mücadele'nin Başlangıcı",
        description: "Mustafa Kemal Paşa'nın 19 Mayıs'ta Samsun'a çıkışıyla Kurtuluş Savaşı ve bağımsızlık meşalesi resmen yakıldı.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: null, lat: 41.29, lng: 36.33
    },
    {
        year: 1919, type: "congress", text: "📜 Erzurum Kongresi",
        description: "'Milli sınırlarla çevrili vatan bir bütündür, parçalanamaz' ilkesi benimsenerek Temsil Heyeti oluşturuldu.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: null, lat: 39.9042, lng: 41.2679
    },
    {
        year: 1919, type: "congress", text: "📜 Sivas Kongresi",
        description: "Bütün milli cemiyetler Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti altında birleştirildi, Temsil Heyeti tüm yurdu temsil eder hale geldi.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: null, lat: 39.7477, lng: 37.0179
    },
    {
        year: 1920, type: "diplomacy", text: "📜 Sevr Antlaşması",
        description: "Osmanlı'yı paylaşma planı içeren antlaşma Ankara'daki TBMM tarafından kesinlikle reddedildi ve hukuken geçersiz kılındı.",
        leader: "Damat Ferid Paşa", flag1: flags.uk, flag2: flags.otto_late, lat: 48.85, lng: 2.35
    },
    {
        year: 1921, type: "war", text: "⚔️ Sakarya Meydan Muharebesi",
        description: "22 gün 22 gece süren savaşta 'Hattı müdafaa yoktur, sathı müdafaa vardır' emriyle Yunan ilerleyişi durduruldu ve geri püskürtüldü.",
        leader: "Başkomutan Mustafa Kemal Paşa", flag1: flags.turkey, flag2: flags.greece, lat: 39.65, lng: 32.35
    },
    {
        year: 1922, type: "war", text: "⚔️ Büyük Taarruz ve Başkomutanlık Meydan Muharebesi",
        description: "30 Ağustos zaferinin ardından 9 Eylül'de İzmir'e girildi; Kurtuluş Savaşı askeri safhada zaferle tamamlandı ve Anadolu temizlendi.",
        leader: "Başkomutan Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: flags.greece, lat: 38.76, lng: 30.54
    },
    {
        year: 1923, type: "diplomacy", text: "🤝 Lozan Barış Antlaşması",
        description: "Yeni Türk Devleti'nin misak-ı milli sınırları, egemenliği ve tam bağımsızlığı tüm dünya devletleri tarafından resmen tescil edildi.",
        leader: "İsmet İnönü", flag1: flags.turkey, flag2: flags.uk, lat: 46.5197, lng: 6.6323
    },
    {
        year: 1923, type: "event", text: "🇹🇷 Türkiye Cumhuriyeti'nin İlanı",
        description: "Cumhuriyet yönetimi ilan edildi; Mustafa Kemal Atatürk oy birliğiyle Türkiye Cumhuriyeti'nin ilk Cumhurbaşkanı seçildi.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: null, lat: 39.9334, lng: 32.8597
    },
    {
        year: 1926, type: "diplomacy", text: "🤝 Ankara Antlaşması (Musul Sorunu)",
        description: "İngiltere ile yapılan anlaşma sonucu Musul ve Kerkük Irak'a bırakıldı, günümüz Türkiye-Irak sınırı çizilmiş oldu.",
        leader: "Tevfik Rüştü Aras", flag1: flags.turkey, flag2: flags.uk, lat: 39.9334, lng: 32.8597
    },
    {
        year: 1928, type: "event", text: "🔤 Harf Devrimi",
        description: "Yeni Türk alfabesi kabul edilerek okuma-yazma seferberliği ve çağdaş eğitim hamlesi Türkiye genelinde başlatıldı.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: null, lat: 39.9334, lng: 32.8597
    },
    {
        year: 1932, type: "diplomacy", text: "🌐 Milletler Cemiyeti'ne Katılım",
        description: "Türkiye, genel kurulun daveti üzerine uluslararası alanda barışçıl diplomasi izleyerek Milletler Cemiyeti'ne üye oldu.",
        leader: "Mustafa Kemal Atatürk", flag1: flags.turkey, flag2: flags.un, lat: 46.2044, lng: 6.1432
    },
    {
        year: 1936, type: "diplomacy", text: "🚢 Montrö Boğazlar Sözleşmesi",
        description: "Uluslararası Boğazlar Komisyonu kaldırıldı; İstanbul ve Çanakkale boğazlarının tüm egemenliği ve denetimi Türkiye'ye devredildi.",
        leader: "Tevfik Rüştü Aras", flag1: flags.turkey, flag2: flags.uk, lat: 46.4312, lng: 6.9107
    },
    {
        year: 1939, type: "diplomacy", text: "🇹🇷 Hatay'ın Anavatana Katılması",
        description: "Hatay Millet Meclisi'nin oy birliğiyle aldığı tarihi kararla Hatay Devleti Türkiye Cumhuriyeti sınırlarına katıldı.",
        leader: "Tayfur Sökmen", flag1: flags.turkey, flag2: flags.france, lat: 36.2023, lng: 36.1613
    },
    {
        year: 1950, type: "war", text: "⚔️ Kore Savaşı (Türk Tugayı)",
        description: "BM gücü kapsamında Kore'ye giden Türk Tugayı, Kunuri muharebelerinde büyük bir kahramanlık gösterdi ve Türkiye'nin 1952'de NATO'ya girişini kolaylaştırdı.",
        leader: "Tahsin Yazıcı", flag1: flags.turkey, flag2: flags.china, lat: 37.5665, lng: 126.9780
    },
    {
        year: 1974, type: "war", text: "⚔️ Kıbrıs Barış Harekâtı",
        description: "Türk soydaşların can güvenliğini sağlamak ve Ada'da barışı tesis etmek amacıyla düzenlenen kara ve hava harekâtıyla Barış Koridoru oluşturuldu.",
        leader: "Bülent Ecevit", flag1: flags.turkey, flag2: flags.cyprus, lat: 35.1856, lng: 33.3823
    },
    {
        year: 1996, type: "war", text: "⚔️ Kardak Kayalıkları Krizi",
        description: "Ege'deki kriz sonrası SAT komandolarının gece operasyonuyla Kardak Kayalıkları'na çıkıp Türk bayrağı dikmesiyle gerilim diplomasiyle çözüldü.",
        leader: "Tansu Çiller", flag1: flags.turkey, flag2: flags.greece, lat: 37.0505, lng: 27.1491
    },
    {
        year: 2018, type: "war", text: "⚔️ Zeytin Dalı Harekâtı",
        description: "TSK ve Suriye Millî Ordusu, Afrin bölgesindeki terör unsurlarını temizleyerek sınır güvenliğini ve bölgedeki huzuru yeniden tesis etti.",
        leader: "Türk Silahlı Kuvvetleri", flag1: flags.turkey, flag2: flags.syria, lat: 36.5100, lng: 36.8683
    }
];

timeline.min = 0;
timeline.max = events.length - 1;
timeline.step = 1;
timeline.value = 0;

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
        marker.setOpacity(visible ? 1 : 0.25);
        count++;

        if (count >= 20) {
            clearInterval(eventAnimation);
            eventAnimation = null;
            marker.setOpacity(1);
        }
    }, 100);
}

function showEvent(index) {
    const event = events[index];
    if (!event) return;

    currentEventIndex = index;

    // VS KARTININ YENİ DÜZENİ (Üst bar içerisine veya sağ üst köşeye dinamik yerleşim)
    let vsContainer = document.getElementById("vs-card");
    if (!vsContainer) {
        vsContainer = document.createElement("div");
        vsContainer.id = "vs-card";
        if (topBar) {
            topBar.appendChild(vsContainer);
        } else {
            document.body.appendChild(vsContainer);
        }
    }

    vsContainer.style.cssText = "display: flex; justify-content: flex-end; margin-left: auto; width: fit-content;";

    if (event.flag1 && event.flag2) {
        vsContainer.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(10px); padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 8px 20px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
                <img src="${event.flag1}" style="width: 28px; height: 18px; border-radius: 3px; object-fit: cover; border: 1px solid rgba(255,255,255,0.3);" alt="Kazanan Taraf">
                <div style="display: flex; flex-direction: column; align-items: center; line-height: 1;">
                    <span style="font-size: 15px; font-weight: 800; color: #ffffff;">${event.year}</span>
                    <span style="font-size: 8px; font-weight: 900; color: #ffffff; background: #ef4444; padding: 1px 4px; border-radius: 3px; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">VS</span>
                </div>
                <img src="${event.flag2}" style="width: 28px; height: 18px; border-radius: 3px; object-fit: cover; border: 1px solid rgba(255,255,255,0.3);" alt="Rakip Taraf">
            </div>
        `;
        vsContainer.style.display = "flex";
    } else if (event.flag1) {
        vsContainer.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(10px); padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 8px 20px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
                <img src="${event.flag1}" style="width: 28px; height: 18px; border-radius: 3px; object-fit: cover; border: 1px solid rgba(255,255,255,0.3);" alt="Bayrak">
                <span style="font-size: 16px; font-weight: 800; color: #ffffff;">${event.year}</span>
            </div>
        `;
        vsContainer.style.display = "flex";
    } else {
        vsContainer.style.display = "none";
    }

    // SOL ALT BİLGİ KUTUSU
    eventInfo.innerHTML = `
        <strong>${event.text}</strong>
        <span>${event.description}</span>
    `;

    if (activeMarker !== null) {
        harita.removeLayer(activeMarker);
        activeMarker = null;
    }

    let selectedIcon = greenIcon;
    if (event.type === "war") selectedIcon = redIcon;
    else if (event.type === "diplomacy") selectedIcon = blueIcon;
    else if (event.type === "congress") selectedIcon = goldIcon;

    activeMarker = L.marker([event.lat, event.lng], { icon: selectedIcon }).addTo(harita);

    activeMarker.bindPopup(`
        <div style="min-width:180px; max-width:240px; text-align:center; padding: 4px;">
            <div style="font-size:11px; color:#94a3b8; font-weight:bold; letter-spacing:0.5px; margin-bottom:2px;">YIL ${event.year}</div>
            <h4 style="margin:0 0 6px 0; font-size:14px; color:#f59e0b; font-family:'Cinzel', serif;">${event.text}</h4>
            <div style="font-size:12px; color:#cbd5e1; font-weight:600;">👑 Komutan / Lider: <span style="color:#ffffff;">${event.leader}</span></div>
        </div>
    `);

    harita.flyTo([event.lat, event.lng], 7, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
    });

    animateEvent(activeMarker);

    setTimeout(function () {
        if (activeMarker !== null) {
            activeMarker.openPopup();
        }
        harita.invalidateSize();
    }, 1500);
}

function goToNextWar() {
    let nextWarIndex = -1;

    for (let i = currentEventIndex + 1; i < events.length; i++) {
        if (events[i].type === "war") {
            nextWarIndex = i;
            break;
        }
    }

    if (nextWarIndex === -1) {
        for (let i = 0; i < events.length; i++) {
            if (events[i].type === "war") {
                nextWarIndex = i;
                break;
            }
        }
    }

    if (nextWarIndex !== -1) {
        timeline.value = nextWarIndex;
        showEvent(nextWarIndex);
    }
}

timeline.addEventListener("input", function () {
    showEvent(Number(timeline.value));
});

if (nextWarBtn) {
    nextWarBtn.addEventListener("click", goToNextWar);
}

showEvent(0);

window.addEventListener("resize", function () {
    harita.invalidateSize();
});

setTimeout(function () {
    harita.invalidateSize();
}, 500);