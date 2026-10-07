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
    dragging: true,
    tap: true
}).setView([39, 35], 5);


// ========================================
// MAPLIBRE / OPENFREEMAP
// ========================================

const mapStyle = "https://tiles.openfreemap.org/styles/liberty";

L.maplibreGL({
    style: mapStyle
}).addTo(harita);


// ========================================
// ZOOM AYARLARI
// ========================================

harita.setMinZoom(3);
harita.setMaxZoom(18);


// ========================================
// ÖZEL RENKLİ MARKER (İMLEÇ) SİSTEMİ
// ========================================

// Kırmızı: Savaşlar
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Mavi: Diplomatik Görüşmeler & Antlaşmalar
const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Sarı/Altın: Kongreler & Genelgeler
const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Yeşil: Genel Tarihi Olaylar
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


// ========================================
// HTML ELEMANLARI
// ========================================

const timeline = document.getElementById("timeline");
const yearDisplay = document.getElementById("year");
const eventInfo = document.getElementById("eventInfo");
const nextWarBtn = document.getElementById("nextWarBtn");


// ========================================
// DEĞİŞKENLER
// ========================================

let activeMarker = null;
let eventAnimation = null;
let currentEventIndex = 0;


// ========================================
// TARİHSEL OLAYLAR (GÖRSEL / BAYRAK DESTEKLİ)
// ========================================

const events = [
    {
        year: 1071,
        type: "war",
        text: "⚔️ Malazgirt Savaşı",
        description: "Büyük Selçuklu Sultanı Alp Arslan ile Bizans İmparatoru Romanos Diogenes arasında gerçekleşen bu tarihi meydan muharebesi, Selçuklu zaferiyle sonuçlanmış ve Anadolu'nun kapılarını Türkler için ardına kadar açmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Alp_Arslan_in_Malazgirt.jpg/300px-Alp_Arslan_in_Malazgirt.jpg",
        leader: "Sultan Alp Arslan",
        lat: 39.15,
        lng: 42.54
    },
    {
        year: 1097,
        type: "war",
        text: "⚔️ I. Haçlı Seferi",
        description: "Batı Avrupa'dan yola çıkan dev Haçlı ordularının Anadolu üzerinden Kudüs'e doğru ilerlediği; İznik ve Urfa gibi stratejik bölgelerin el değiştirdiği yoğun çatışmalar dönemidir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Taking_of_Jerusalem_1099.jpg/300px-Taking_of_Jerusalem_1099.jpg",
        leader: "I. Kılıç Arslan",
        lat: 40.43,
        lng: 29.72
    },
    {
        year: 1176,
        type: "war",
        text: "⚔️ Miryokefalon Savaşı",
        description: "Anadolu Selçuklu Sultanı II. Kılıç Arslan'ın Bizans ordusunu ağır bir yenilgiye uğrattığı zaferdir. Bu savaşla birlikte Bizans'ın Türkleri Anadolu'dan atma ümidi tamamen sona ermiş ve Anadolu kesin olarak Türk yurdu sayılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Battle_of_Myriokephalon.jpg/300px-Battle_of_Myriokephalon.jpg",
        leader: "II. Kılıç Arslan",
        lat: 38.12,
        lng: 29.77
    },
    {
        year: 1243,
        type: "war",
        text: "⚔ Kösedağ Savaşı",
        description: "Anadolu Selçuklu Devleti ile Moğol İlhanlı kuvvetleri arasında gerçekleşen ve Selçukluların mağlubiyetiyle sonuçlanan savaştır. Anadolu'da Moğol hâkimiyeti başlamış ve İkinci Beylikler Dönemi'nin zeminini hazırlamıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Battle_of_Kosedag.jpg/300px-Battle_of_Kosedag.jpg",
        leader: "II. Gıyaseddin Keyhüsrev",
        lat: 39.80,
        lng: 36.30
    },
    {
        year: 1299,
        type: "event",
        text: "🏹 Osmanlı Beyliği'nin Kuruluşu",
        description: "Osman Bey önderliğinde Söğüt ve Domaniç çevresinde temelleri atılan Osmanlı Beyliği, Bizans sınırındaki uç konumunu stratejik bir avantaj olarak kullanarak hızlı bir genişleme sürecine girmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Osman_Gazi.jpg/300px-Osman_Gazi.jpg",
        leader: "Osman Gazi",
        lat: 40.14,
        lng: 30.15
    },
    {
        year: 1302,
        type: "war",
        text: "⚔️ Bapheus (Koyunhisar) Savaşı",
        description: "Osmanlı Beyliği ile Bizans İmparatorluğu arasında yapılan ilk resmi meydan savaşıdır. Osman Bey'in kazandığı bu zafer, Osmanlı'nın bölgedeki bağımsızlığını ve askeri gücünü tüm bölgeye kabul ettirmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Osman_Gazi.jpg/300px-Osman_Gazi.jpg",
        leader: "Osman Gazi",
        lat: 40.70,
        lng: 29.60
    },
    {
        year: 1389,
        type: "war",
        text: "⚔️ I. Kosova Savaşı",
        description: "Sultan I. Murad komutasındaki Osmanlı ordusu ile Balkan Müttefik kuvvetleri arasında gerçekleşmiştir. Osmanlı zaferiyle biten savaş sonunda I. Murad şehit düşmüş, Türklerin Balkanlar'daki hâkimiyeti sağlamlaşmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Battle_of_Kosovo_1389.jpg/300px-Battle_of_Kosovo_1389.jpg",
        leader: "Sultan I. Murad",
        lat: 42.64,
        lng: 21.10
    },
    {
        year: 1402,
        type: "war",
        text: "⚔ Ankara Savaşı",
        description: "Timur İmparatorluğu ile Osmanlı Sultanı I. Bayezid (Yıldırım) arasında Çubuk Ovası'nda gerçekleşen devasa meydan muharebesidir. Osmanlı'nın yenilgisiyle 11 yıl sürecek Fetret Dönemi başlamıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Battle_of_Ankara.jpg/300px-Battle_of_Ankara.jpg",
        leader: "Yıldırım Bayezid & Timur",
        lat: 39.93,
        lng: 32.85
    },
    {
        year: 1444,
        type: "war",
        text: "⚔️ Varna Savaşı",
        description: "Sultan II. Murad önderliğindeki Osmanlı ordusunun, Papalık teşvikiyle toplanan geniş Haçlı ordusunu Varna yakınlarında bozguna uğrattığı stratejik bir zaferdir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Battle_of_Varna.jpg/300px-Battle_of_Varna.jpg",
        leader: "Sultan II. Murad",
        lat: 43.21,
        lng: 27.91
    },
    {
        year: 1453,
        type: "event",
        text: "🏛️ İstanbul'un Fethi",
        description: "21 yaşındaki Osmanlı Sultanı II. Mehmed (Fatih) komutasındaki ordunun 53 günlük kuşatma sonucunda Bin yıllık Bizans İmparatorluğu'na son verip İstanbul'u fethettiği, Orta Çağ'ı kapatıp Yeni Çağ'ı başlatan tarihi olaydır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Fatih_Sultan_Mehmet_entering_Constantinople.jpg/300px-Fatih_Sultan_Mehmet_entering_Constantinople.jpg",
        leader: "Fatih Sultan Mehmed",
        lat: 41.0082,
        lng: 28.9784
    },
    {
        year: 1473,
        type: "war",
        text: "⚔️ Otlukbeli Savaşı",
        description: "Fatih Sultan Mehmed ile Akkoyunlu Hükümdarı Uzun Hasan arasında yapılan meydan savaşıdır. Ateşli silahların etkin kullanımıyla Osmanlı kesin bir zafer kazanmış ve Doğu Anadolu sınırları güvenceye alınmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Mehmed_II_by_Gentile_Bellini.jpg/300px-Mehmed_II_by_Gentile_Bellini.jpg",
        leader: "Fatih Sultan Mehmed",
        lat: 39.92,
        lng: 40.00
    },
    {
        year: 1514,
        type: "war",
        text: "⚔️ Çaldıran Savaşı",
        description: "Yavuz Sultan Selim ile Safevî Şahı İsmail arasında gerçekleşen büyük muharebedir. Osmanlı sahra topçularının üstünlüğü sayesinde kazanılan bu zaferle Doğu Anadolu ve Kuzey Irak Osmanlı kontrolüne geçmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yavuz_Sultan_Selim.jpg/300px-Yavuz_Sultan_Selim.jpg",
        leader: "Yavuz Sultan Selim",
        lat: 38.99,
        lng: 43.99
    },
    {
        year: 1517,
        type: "war",
        text: "⚔️ Mısır Seferi (Ridaniye Savaşı)",
        description: "Yavuz Sultan Selim'in Memlük Devleti'ne karşı gerçekleştirdiği seferdir. Mısır, Suriye ve Hicaz toprakları Osmanlı İmparatorluğu'na katılmış, Halifelik makamı Osmanlı hanedanına geçmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yavuz_Sultan_Selim.jpg/300px-Yavuz_Sultan_Selim.jpg",
        leader: "Yavuz Sultan Selim",
        lat: 30.04,
        lng: 31.24
    },
    {
        year: 1526,
        type: "war",
        text: "⚔️ Mohaç Meydan Muharebesi",
        description: "Kanuni Sultan Süleyman komutasındaki Osmanlı ordusunun Macaristan Krallığı'nı sadece 2 saat gibi kısa bir sürede mağlup ettiği, Macaristan'ın Osmanlı kontrolüne girmesini sağlayan tarihi savaş.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Moha%C4%8D_1526.jpg/300px-Moha%C4%8D_1526.jpg",
        leader: "Kanuni Sultan Süleyman",
        lat: 45.95,
        lng: 18.68
    },
    {
        year: 1529,
        type: "war",
        text: "⚔️ I. Viyana Kuşatması",
        description: "Kanuni Sultan Süleyman'ın Avusturya üzerine düzenlediği seferde Viyana şehri ilk kez kuşatılmış, ancak kış şartlarının yaklaşması ve lojistik sebeplerle kuşatma kaldırılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Siege_of_Vienna_1529.jpg/300px-Siege_of_Vienna_1529.jpg",
        leader: "Kanuni Sultan Süleyman",
        lat: 48.21,
        lng: 16.37
    },
    {
        year: 1571,
        type: "war",
        text: "⚔️ Kıbrıs'ın Fethi",
        description: "Lala Mustafa Paşa komutasındaki Osmanlı donanması ve kara birliklerinin Venedik kontrolündeki Kıbrıs adasını fethetmesidir. Doğu Akdeniz ticaret yollarının güvenliği tam olarak sağlanmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Siege_of_Famagusta.jpg/300px-Siege_of_Famagusta.jpg",
        leader: "Lala Mustafa Paşa",
        lat: 35.13,
        lng: 33.43
    },
    {
        year: 1683,
        type: "war",
        text: "⚔️ II. Viyana Kuşatması",
        description: "Merzifonlu Kara Mustafa Paşa komutasındaki Osmanlı ordusunun Viyana'yı ikinci kez kuşatmasıdır. Haçlı müttefik ordusunun yardıma gelmesiyle Osmanlı ordusu geri çekilmek zorunda kalmış ve Gerileme Dönemi'nin başlangıcı olmuştur.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Relief_of_Vienna_1683.jpg/300px-Relief_of_Vienna_1683.jpg",
        leader: "Merzifonlu Kara Mustafa Paşa",
        lat: 48.21,
        lng: 16.37
    },
    {
        year: 1699,
        type: "diplomacy",
        text: "📜 Karlofça Antlaşması",
        description: "Kutsal İttifak savaşları sonrasında imzalanan bu antlaşma, Osmanlı İmparatorluğu'nun Batı'da büyük çapta toprak kaybettiği ilk uluslararası antlaşmadır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Treaty_of_Karlowitz.jpg/300px-Treaty_of_Karlowitz.jpg",
        leader: "II. Mustafa / Rami Mehmed Efendi",
        lat: 45.26,
        lng: 19.83
    },
    {
        year: 1711,
        type: "war",
        text: "⚔️ Prut Savaşı",
        description: "Baltacı Mehmet Paşa komutasındaki Osmanlı ordusunun Rus Çarı I. Petro'nun ordusunu Prut Nehir kıyısında kuşatarak mağlup ettiği ve Karlofça'da kaybedilen yerlerin bir kısmının geri alındığı savaştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Baltaci_Mehmed_Pasha.jpg/300px-Baltaci_Mehmed_Pasha.jpg",
        leader: "Baltacı Mehmet Paşa",
        lat: 46.95,
        lng: 28.25
    },
    {
        year: 1774,
        type: "diplomacy",
        text: "📜 Küçük Kaynarca Antlaşması",
        description: "Osmanlı-Rus Savaşı sonrasında imzalanan son derece ağır bir antlaşmadır. Kırım bağımsız olmuş ve Rusya, Osmanlı coğrafyasındaki Ortodoksların hami haklarını elde etmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Treaty_of_Kucuk_Kaynarca.jpg/300px-Treaty_of_Kucuk_Kaynarca.jpg",
        leader: "I. Abdülhamid",
        lat: 45.33,
        lng: 28.40
    },
    {
        year: 1821,
        type: "war",
        text: "⚔️ Yunan İsyanı",
        description: "Mora Yarımadası'nda Avrupalı devletlerin desteğiyle Osmanlı yönetiminin karşısında başlayan isyandır. 1829 Edirne Antlaşması ile Yunanistan bağımsızlığını kazanmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Greek_War_of_Independence.jpg/300px-Greek_War_of_Independence.jpg",
        leader: "II. Mahmud",
        lat: 37.98,
        lng: 23.72
    },
    {
        year: 1853,
        type: "war",
        text: "⚔️ Kırım Savaşı",
        description: "Osmanlı Devleti'nin İngiltere ve Fransa ile ittifak kurarak Rusya'ya karşı mücadele ettiği savaştır. Osmanlı tarihinde ilk kez dış borç alınmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Charge_of_the_Light_Brigade.jpg/300px-Charge_of_the_Light_Brigade.jpg",
        leader: "Sultan Abdülmecid",
        lat: 44.95,
        lng: 34.10
    },
    {
        year: 1877,
        type: "war",
        text: "⚔️ 93 Harbi (1877-1878 Osmanlı-Rus Savaşı)",
        description: "Gazi Osman Paşa'nın Plevne Savunması ve Nene Hatun'un Aziziye Tabyalarındaki direnişiyle simgeleşen; Osmanlı'nın Balkanlar ve Kafkasya'da devasa topraklar kaybettiği yıkıcı bir savaştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Gazi_Osman_Pasha.jpg/300px-Gazi_Osman_Pasha.jpg",
        leader: "Gazi Osman Paşa & II. Abdülhamid",
        lat: 43.21,
        lng: 27.91
    },
    {
        year: 1912,
        type: "war",
        text: "⚔️ Balkan Savaşları",
        description: "Balkan devletlerinin birleşerek Osmanlı'ya saldırdığı çatışmalar dizisidir. Osmanlı Devleti Rumeli'deki hemen hemen tüm topraklarını kaybetmiş ve Doğu Trakya'yı güçlükle elinde tutabilmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/First_Balkan_War.jpg/300px-First_Balkan_War.jpg",
        leader: "Enver Paşa & Mahmud Şevket Paşa",
        lat: 41.00,
        lng: 21.00
    },
    {
        year: 1914,
        type: "war",
        text: "⚔️ I. Dünya Savaşı'nın Başlaması",
        description: "Osmanlı Devleti'nin İttifak Devletleri yanında savaşa girmesiyle Kafkasya, Çanakkale, Kanal, Irak ve Hicaz gibi geniş bir coğrafyada birden fazla cephede amansız mücadeleler başlamıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Ottoman_troops_1914.jpg/300px-Ottoman_troops_1914.jpg",
        leader: "Enver Paşa",
        lat: 40.00,
        lng: 35.00
    },
    {
        year: 1915,
        type: "war",
        text: "⚔ Çanakkale Savaşları",
        description: "İtilaf Devletleri donanması ve kara birliklerinin İstanbul'a ulaşmak amacıyla Gelibolu'ya yaptığı çıkarma harekâtıdır. Türk milletinin 'Çanakkale Geçilmez' destanını yazdığı ve Mustafa Kemal'in askeri dehasının parladığı zaferdir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mustafa_Kemal_Ataturk_in_Gallipoli_1915.jpg/300px-Mustafa_Kemal_Ataturk_in_Gallipoli_1915.jpg",
        leader: "Mustafa Kemal Paşa & Cevat Paşa",
        lat: 40.15,
        lng: 26.40
    },
    {
        year: 1916,
        type: "war",
        text: "⚔️ Kut'ül Amare Zaferi",
        description: "Irak Cephesi'nde Halil Kut Paşa komutasındaki Osmanlı kuvvetlerinin, İngiliz General Townshend ve 13 bin askerini kuşatarak esir aldığı I. Dünya Savaşı'nın en büyük zaferlerinden biridir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Halil_Kut_Pasha.jpg/300px-Halil_Kut_Pasha.jpg",
        leader: "Halil Kut Paşa",
        lat: 32.50,
        lng: 45.80
    },
    {
        year: 1918,
        type: "diplomacy",
        text: "📜 Mondros Ateşkes Antlaşması",
        description: "I. Dünya Savaşı sonunda Limni Adası'nda imzalanan ağır şartlara sahip mütarekedir. 7. ve 24. maddeleriyle İtilaf Devletleri'ne Anadolu'yu işgal etme bahanesi sunmuştur.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rauf_Orbay.jpg/300px-Rauf_Orbay.jpg",
        leader: "Rauf Orbay",
        lat: 40.10,
        lng: 25.70
    },
    {
        year: 1919,
        type: "event",
        text: "🇹🇷 Millî Mücadele'nin Başlangıcı",
        description: "Mustafa Kemal Paşa'nın 19 Mayıs 1919'da Bandırma Vapuru ile Samsun'a ayak basarak Türk Kurtuluş Savaşı'nı resmen başlattığı ve genelgelerle milleti örgütlemeye başladığı süreçtir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mustafa_Kemal_Samsun.jpg/300px-Mustafa_Kemal_Samsun.jpg",
        leader: "Mustafa Kemal Atatürk",
        lat: 41.29,
        lng: 36.33
    },
    {
        year: 1919,
        type: "congress",
        text: "📜 Erzurum Kongresi",
        description: "Mustafa Kemal Paşa başkanlığında toplanan kongrede 'Vatan bir bütündür, parçalanamaz' ilkesi kabul edilmiş ve Millî Mücadele'nin temelleri atılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Erzurum_Kongresi.jpg/300px-Erzurum_Kongresi.jpg",
        leader: "Mustafa Kemal Atatürk & Kâzım Karabekir",
        lat: 39.9042,
        lng: 41.2679
    },
    {
        year: 1919,
        type: "congress",
        text: "📜 Sivas Kongresi",
        description: "Tüm cemiyetler Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti adı altında birleştirilmiş, Millî Mücadele tek bir merkezden yönetilmeye başlanmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Sivas_Kongresi_bina.jpg/300px-Sivas_Kongresi_bina.jpg",
        leader: "Mustafa Kemal Atatürk",
        lat: 39.7477,
        lng: 37.0179
    },
    {
        year: 1920,
        type: "diplomacy",
        text: "📜 Sevr Antlaşması",
        description: "İtilaf Devletleri ile Osmanlı Hükümeti arasında Paris'te imzalanan ancak Ankara'daki TBMM tarafından kesinlikle reddedilen, Türk milletini yok etmeyi amaçlayan ölü doğmuş antlaşmadır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Treaty_of_Sevres.jpg/300px-Treaty_of_Sevres.jpg",
        leader: "Damat Ferid Paşa (TBMM Reddetti)",
        lat: 48.85,
        lng: 2.35
    },
    {
        year: 1921,
        type: "war",
        text: "⚔️ Sakarya Meydan Muharebesi",
        description: "Mustafa Kemal Paşa'nın 'Hattı müdafaa yoktur, sathı müdafaa vardır' emriyle yönettiği 22 gün 22 gece süren kanlı savaştır. Türk ordusunun Viyana Kuşatması'ndan beri süren geri çekilişi sona ermiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Mustafa_Kemal_Sakarya_Battle.jpg/300px-Mustafa_Kemal_Sakarya_Battle.jpg",
        leader: "Başkomutan Mustafa Kemal Paşa & İsmet Paşa",
        lat: 39.65,
        lng: 32.35
    },
    {
        year: 1922,
        type: "war",
        text: "⚔️ Büyük Taarruz ve Başkomutanlık Meydan Muharebesi",
        description: "26 Ağustos'ta Afyon'da başlayan ve 30 Ağustos'ta zaferle taçlanan büyük askerî harekâttır. Yunan ordusu tamamen bozguna uğratılmış ve 9 Eylül'de İzmir'in kurtarılmasıyla Anadolu düşmandan temizlenmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Mustafa_Kemal_Ataturk_Kocatepe.jpg/300px-Mustafa_Kemal_Ataturk_Kocatepe.jpg",
        leader: "Başkomutan Mustafa Kemal Atatürk & Fevzi Çakmak",
        lat: 38.76,
        lng: 30.54
    },
    {
        year: 1923,
        type: "diplomacy",
        text: "🤝 Lozan Barış Antlaşması",
        description: "İsviçre'nin Lozan şehrinde gerçekleştirilen çetin diplomatik görüşmeler sonucunda Yeni Türk Devletinin bağımsızlığı ve sınırları tüm dünyaca kabul edilmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ismet_Inonu_Lozan.jpg/300px-Ismet_Inonu_Lozan.jpg",
        leader: "İsmet İnönü",
        lat: 46.5197,
        lng: 6.6323
    },
    {
        year: 1923,
        type: "event",
        text: "🇹🇷 Türkiye Cumhuriyeti'nin İlanı",
        description: "Lozan Barış Antlaşması'nın ardından 29 Ekim 1923'te TBMM'de kabul edilen kararla Türkiye Cumhuriyeti ilan edilmiş, Cumhurbaşkanlığına Mustafa Kemal Atatürk seçilmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ataturk_Cumhuriyet.jpg/300px-Ataturk_Cumhuriyet.jpg",
        leader: "Mustafa Kemal Atatürk",
        lat: 39.9334,
        lng: 32.8597
    },
    {
        year: 1926,
        type: "diplomacy",
        text: "🤝 Ankara Antlaşması (Musul Görüşmeleri)",
        description: "Türkiye ile İngiltere arasında sürdürülen diplomatik temaslar ve görüşmeler neticesinde Musul meselesi sınır ve petrol gelirleri protokolü ile karara bağlanmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ataturk_Cumhuriyet.jpg/300px-Ataturk_Cumhuriyet.jpg",
        leader: "Tevfik Rüştü Aras",
        lat: 39.9334,
        lng: 32.8597
    },
    {
        year: 1928,
        type: "event",
        text: "🔤 Harf Devrimi",
        description: "Türkçe alfabe yenilenerek Latin tabanlı Türk alfabesi kabul edilmiş, okuma yazma seferberliği (Millet Mektepleri) başlatılarak okullaşma oranında büyük hamle yapılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Ataturk_Harf_Devrimi.jpg/300px-Ataturk_Harf_Devrimi.jpg",
        leader: "Mustafa Kemal Atatürk",
        lat: 39.9334,
        lng: 32.8597
    },
    {
        year: 1932,
        type: "diplomacy",
        text: "🌐 Milletler Cemiyeti'ne Katılım",
        description: "Türkiye Cumhuriyeti, yürüttüğü barışçıl dış politika ('Yurtta sulh, cihanda sulh') doğrultusunda davet üzerine Milletler Cemiyeti'ne resmen katılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ataturk_Cumhuriyet.jpg/300px-Ataturk_Cumhuriyet.jpg",
        leader: "Mustafa Kemal Atatürk & Tevfik Rüştü Aras",
        lat: 46.2044,
        lng: 6.1432
    },
    {
        year: 1936,
        type: "diplomacy",
        text: "🚢 Montrö Boğazlar Sözleşmesi",
        description: "İsviçre'de yapılan uluslararası görüşmeler neticesinde Montrö Sözleşmesi imzalanmış; Boğazlar üzerindeki tüm egemenlik ve askeri denetim hakları Türkiye Cumhuriyeti'ne geçmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Montreux_Convention_1936.jpg/300px-Montreux_Convention_1936.jpg",
        leader: "Tevfik Rüştü Aras",
        lat: 46.4312,
        lng: 6.9107
    },
    {
        year: 1939,
        type: "diplomacy",
        text: "🇹🇷 Hatay'ın Anavatana Katılması",
        description: "Hatay Millet Meclisi'nin oy birliğiyle aldığı karar ve sürdürülen diplomatik mücadeleler doğrultusunda Hatay, Türkiye Cumhuriyeti sınırlarına katılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tayfur_S%C3%B6kmen.jpg/300px-Tayfur_S%C3%B6kmen.jpg",
        leader: "Tayfur Sökmen & İsmet İnönü",
        lat: 36.2023,
        lng: 36.1613
    },
    {
        year: 1950,
        type: "war",
        text: "⚔️ Kore Savaşı (Türk Tugayı)",
        description: "Türkiye'nin Birleşmiş Milletler gücü kapsamında Kore'ye gönderdiği Türk Tugayı, Kunuri Muharebeleri'nde gösterdiği üstün kahramanlık ve direnişle dünya tarihine geçmiştir.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Korean_War_Turkish_Brigade.jpg/300px-Korean_War_Turkish_Brigade.jpg",
        leader: "Tuğgeneral Tahsin Yazıcı",
        lat: 37.5665,
        lng: 126.9780
    },
    {
        year: 1974,
        type: "war",
        text: "⚔️ Kıbrıs Barış Harekâtı",
        description: "Türk Silahlı Kuvvetleri'nin Kıbrıs'taki Türk varlığını ve can güvenliğini korumak amacıyla gerçekleştirdiği hava ve deniz indirme harekâtıdır. Ada'da barış sağlanmış ve KKTC'nin temelleri atılmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/K%C4%B1br%C4%B1s_Bar%C4%B1%C5%9F_Harekat%C4%B1.jpg/300px-K%C4%B1br%C4%B1s_Bar%C4%B1%C5%9F_Harekat%C4%B1.jpg",
        leader: "Bülent Ecevit & Necmettin Erbakan",
        lat: 35.1856,
        lng: 33.3823
    },
    {
        year: 1996,
        type: "war",
        text: "⚔️ Kardak Kayalıkları Krizi",
        description: "Ege Denizi'ndeki Kardak Kayalıkları üzerine çıkan egemenlik anlaşmazlığı sonrasında SAT komandolarının adaya başarılı sızma operasyonuyla kriz çözülmüş ve Türkiye'nin kararlılığı vurgulanmıştır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SAT_Komandolar%C4%B1.jpg/300px-SAT_Komandolar%C4%B1.jpg",
        leader: "Tansu Çiller & TSK Komuta Kademesi",
        lat: 37.0505,
        lng: 27.1491
    },
    {
        year: 2018,
        type: "war",
        text: "⚔️ Zeytin Dalı Harekâtı (Afrin)",
        description: "Türk Silahlı Kuvvetleri ve Suriye Millî Ordusu'nun sınır güvenliğini sağlamak ve bölgedeki terör koridorunu engellemek amacıyla Afrin bölgesinde icra ettiği başarılı sınır ötesi harekâttır.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/TSK_Operasyon.jpg/300px-TSK_Operasyon.jpg",
        leader: "Türk Silahlı Kuvvetleri",
        lat: 36.5100,
        lng: 36.8683
    }
];


// ========================================
// SÜRGÜ AYARLARI (OTOMATİK SENKRONİZE)
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
        marker.setOpacity(visible ? 1 : 0.25);
        count++;

        if (count >= 20) {
            clearInterval(eventAnimation);
            eventAnimation = null;
            marker.setOpacity(1);
        }
    }, 100);
}


// ========================================
// OLAYI GÖSTER (DÜZENLENEN POPUP BÖLÜMÜ)
// ========================================

function showEvent(index) {
    const event = events[index];
    if (!event) return;

    currentEventIndex = index;

    // YIL
    yearDisplay.textContent = event.year;

    // ALT BİLGİ ALANI (Sadece Detaylı Açıklama Metni)
    eventInfo.innerHTML = `
        <strong>${event.text}</strong>
        <span>${event.description}</span>
    `;

    // ESKİ MARKER SİL
    if (activeMarker !== null) {
        harita.removeLayer(activeMarker);
        activeMarker = null;
    }

    // OLAY TİPİNE GÖRE RENKLİ MARKER SEÇİMİ
    let selectedIcon = greenIcon;
    if (event.type === "war") {
        selectedIcon = redIcon;        // Kırmızı = Savaşlar
    } else if (event.type === "diplomacy") {
        selectedIcon = blueIcon;       // Mavi = Diplomatik Görüşmeler & Antlaşmalar
    } else if (event.type === "congress") {
        selectedIcon = goldIcon;       // Sarı/Altın = Kongreler
    }

    // YENİ MARKER EKLE
    activeMarker = L.marker([event.lat, event.lng], { icon: selectedIcon }).addTo(harita);

    // DEĞİŞTİRİLEN POPUP ALANI: Tıklandığında Görsel, Lider/Komutan Adı ve Kısa Bilgi Gösterir
    activeMarker.bindPopup(`
        <div style="min-width:200px; max-width:260px; text-align:center; padding: 2px;">
            <img src="${event.image}" alt="${event.text}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.2);" onerror="this.style.display='none'">
            <h4 style="margin:0 0 4px 0; font-size:14px; color:#f59e0b; font-family:'Cinzel', serif;">${event.text}</h4>
            <div style="font-size:12px; color:#cbd5e1; font-weight:600; margin-bottom:4px;">👑 Komutan / Lider: <span style="color:#fff;">${event.leader}</span></div>
        </div>
    `);

    // FLYTO (SABİT ZOOM)
    harita.flyTo([event.lat, event.lng], 7, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
    });

    // MARKER ANİMASYONU VE POPUP AÇILIŞI
    animateEvent(activeMarker);

    setTimeout(function () {
        if (activeMarker !== null) {
            activeMarker.openPopup();
        }
        harita.invalidateSize();
    }, 1500);
}


// ========================================
// SONRAKİ SAVAŞ
// ========================================

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


// ========================================
// SÜRGÜ DİNLEYİCİSİ
// ========================================

timeline.addEventListener("input", function () {
    const index = Number(timeline.value);
    showEvent(index);
});


// ========================================
// SONRAKİ SAVAŞ BUTONU
// ========================================

if (nextWarBtn) {
    nextWarBtn.addEventListener("click", goToNextWar);
}


// ========================================
// BAŞLANGIÇ
// ========================================

showEvent(0);


// ========================================
// EKRAN BOYUTLANDIRMA UYUMU
// ========================================

window.addEventListener("resize", function () {
    harita.invalidateSize();
});

setTimeout(function () {
    harita.invalidateSize();
}, 500);