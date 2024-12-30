# Tıbbi Test Yönetim Uygulaması


## İçindekiler

- [Giriş](#giriş)
- [Özellikler](#özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Giriş

**Tıbbi Test Yönetim Uygulaması**, hastaların tıbbi testlerini ve ilgili kılavuzlarını yönetmek için tasarlanmış kapsamlı bir React Native uygulamasıdır. Bu uygulama, sağlık profesyonellerinin hasta bilgilerini eklemelerini, düzenlemelerini ve takip etmelerini kolaylaştırır.

## Özellikler

- **Hasta Yönetimi**
  - Tüm hastaların listesini görüntüleme.
  - Yeni hastalar ekleme ve detaylı bilgi girişi.
  - Hastaların adlarına veya "+" butonuna tıklayarak ek detayları görüntüleme.
  - Hasta bazında test detaylarına erişim ve yeni test ekleme.

- **Test Yönetimi**
  - Hastalar için yeni tıbbi testler ekleme.
    - **Tahlil Bilgileri:** Rapor numarası, tanı, numune türü ve rapor grubu girişi.
    - **Tarih ve Saat Bilgileri:** Test süreci ile ilgili çeşitli zaman damgalarını belirleme.
    - **Değerler:** Referans değerleri dinamik olarak ekleme, düzenleme veya silme.
    - **Kılavuz Düzenle:** Test formundan direkt olarak kılavuz bilgilerini düzenleme.

- **Kılavuz Yönetimi**
  - Mevcut kılavuzları görüntüleme ve düzenleme.
  - Referans değerleri ekleme, değiştirme veya silme.
  - "Geometric mean ± SD" veya "Mean ± SD" gibi farklı temel türler için destek.

- **Kullanıcı Dostu Arayüz**
  - Daha iyi veri organizasyonu için genişletilebilir bölümler.
  - Bölümlerin açılıp kapanırken akıcı geçişler sağlayan animasyonlar.

- **Veri Saklama**
  - Veri alma ve yönetme işlemlerinde arka uç servisleri ile entegrasyon.


## Kullanılan Teknolojiler

- **Frontend:**
  - [React Native](https://reactnative.dev/) - React kullanarak yerel mobil uygulamalar oluşturma framework'ü.
  - [React Navigation](https://reactnavigation.org/) - Uygulama içi yönlendirme ve navigasyon.
  - [React Native Community DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker) - Tarih ve saat seçici bileşeni.
  - [React Native Picker](https://github.com/react-native-picker/picker) - Dropdown seçimler için picker bileşeni.

- **Backend Servisleri:**
  - Kullanıcı, kılavuz, referans ve değer verilerini yönetmek için özel servisler.

- **Durum Yönetimi:**
  - React Hooks (`useState`, `useEffect`, `useFocusEffect`) ile bileşen durumu ve yan etkilerini yönetme.

## Kurulum

Proje dizininizi yerel makinenize kurmak için aşağıdaki adımları takip edin:

### Gereksinimler

- **Node.js**: Node.js'in yüklü olduğundan emin olun. [İndirmek için buraya tıklayın](https://nodejs.org/).
- **React Native CLI**: React Native CLI'yi global olarak yükleyin:
  
  ```bash
  npm install -g react-native-cli
Android Studio / Xcode: Android veya iOS simülatörlerini/emülatörlerini çalıştırmak için gerekli araçlar.
Adımlar
Depoyu Klonlayın

bash
Kodu kopyala
git clone [https://github.com/kullaniciadiniz/tibbi-test-yonetim-uygulamasi](https://github.com/hiaksoy/tahlilim).git
Proje Dizini İçine Geçin

bash
Kodu kopyala
cd tahlilim
Bağımlılıkları Yükleyin

bash
Kodu kopyala
npm install
veya yarn kullanıyorsanız:

bash
Kodu kopyala
yarn install
Yerel Bağımlılıkları Linkleyin

React Native 0.60 ve üzeri sürümler için otomatik linkleme işlemi yapılır. Daha düşük sürümler için manuel linkleme gerekebilir:

bash
Kodu kopyala
react-native link
Uygulamayı Çalıştırın

Android için:

bash
Kodu kopyala
react-native run-android
iOS için:

bash
Kodu kopyala
react-native run-ios
Emülatörün çalıştığından veya bir cihazın bağlı olduğundan emin olun.

Kullanım
Uygulama çalışmaya başladıktan sonra:

Hastalar Ekranı:

Tüm hastaların listesini görüntüleyin.
Bir hastanın adına veya "+" butonuna tıklayarak ek detayları açın.
"Hasta Ekle" butonunu kullanarak yeni bir hasta ekleyin.
Test Ekleme Ekranı:

Gerekli bölümleri (Tahlil Bilgileri, Tarih ve Saat Bilgileri, Değerler, Kılavuz Düzenle) doldurun.
"+" butonuna veya bölüm başlığına tıklayarak bölümleri açıp kapatın.
Referans değerlerini dinamik olarak ekleyin ve formu göndererek yeni bir test ekleyin.
Kılavuz Düzenleme Ekranı:

Mevcut kılavuzları görüntüleyin ve düzenleyin.
Yeni referans değerleri ekleyin veya mevcut olanları silin.
Silme işlemi için onay mesajlarını takip edin.


components/: Yeniden kullanılabilir UI bileşenleri.
screens/: Uygulamanın farklı ekranları.
services/: Veri alma ve manipülasyon işlemleri için backend servis entegrasyonları.
shared/: Paylaşılan sabitler ve yardımcı fonksiyonlar.
Katkıda Bulunma
Katkılarınızı bekliyoruz! Katkıda bulunmak için aşağıdaki adımları takip edin:

Depoyu Forklayın

Yeni Bir Dal Oluşturun

bash
Kodu kopyala
git checkout -b ozellik/ozellik-adi
Değişiklikleri Yapın

Değişiklikleri Commit Edin

bash
Kodu kopyala
git commit -m "Bir özellik ekle"
Dalınıza Push Edin

bash
Kodu kopyala
git push origin ozellik/ozellik-adi
Bir Pull Request Açın

Lütfen kodunuzun proje kodlama standartlarına uygun olduğundan ve tüm linting kontrollerini geçtiğinden emin olun.

Lisans
Bu proje MIT Lisansı altında lisanslanmıştır.

Halil ibrahim Aksoy❤️ ile geliştirildi
