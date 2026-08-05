import PageHero from '../../components/page-hero';

function LegalSection({ title, children }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-copy">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Syarat & Ketentuan"
        title="Aturan penggunaan layanan"
        description="Harap baca syarat ini sebelum menggunakan layanan, mengunggah file, atau membagikan hasil proses."
      />
      <section className="section-block">
        <div className="wrap legal-wrap">
          <LegalSection title="1. Penerimaan syarat">
            <p>Dengan mengakses atau menggunakan layanan ini, Anda dianggap telah membaca, memahami, dan menyetujui syarat penggunaan yang berlaku. Jika Anda tidak setuju, mohon hentikan penggunaan layanan.</p>
          </LegalSection>

          <LegalSection title="2. Kelayakan penggunaan">
            <p>Anda bertanggung jawab untuk memastikan bahwa penggunaan layanan ini sesuai dengan hukum yang berlaku di wilayah Anda. Anda juga menyatakan bahwa Anda memiliki hak untuk mengunggah, memproses, atau membagikan konten yang digunakan di dalam layanan.</p>
          </LegalSection>

          <LegalSection title="3. File dan konten pengguna">
            <p>Anda tetap menjadi pemilik atas file, dokumen, gambar, video, teks, atau materi lain yang Anda unggah. Namun, Anda bertanggung jawab penuh atas isi file tersebut, termasuk keakuratan, legalitas, dan izin penggunaan dari pihak yang berkepentingan.</p>
            <p>Jangan mengunggah materi yang melanggar hak cipta, melanggar privasi orang lain, mengandung malware, menyesatkan, melanggar hukum, atau merugikan pihak lain.</p>
          </LegalSection>

          <LegalSection title="4. Batasan penggunaan">
            <p>Layanan ini tidak boleh digunakan untuk aktivitas yang melanggar hukum, merusak sistem, mencoba membobol keamanan, melakukan spam, menyebarkan konten terlarang, atau memproses data yang Anda ketahui tidak punya hak untuk digunakan.</p>
            <p>Kami berhak membatasi, menangguhkan, atau menghentikan akses apabila ditemukan penggunaan yang tidak wajar, berisiko, atau merugikan layanan maupun pihak lain.</p>
          </LegalSection>

          <LegalSection title="5. Ketersediaan layanan">
            <p>Kami berupaya menjaga layanan tetap tersedia, namun tidak menjamin bahwa semua fitur akan selalu berjalan tanpa gangguan. Pembaruan, perubahan, keterbatasan perangkat, jaringan, ukuran file, atau faktor teknis lainnya dapat memengaruhi pengalaman penggunaan.</p>
          </LegalSection>

          <LegalSection title="6. Hasil pemrosesan">
            <p>Hasil yang diberikan layanan dapat bervariasi tergantung jenis file, kualitas sumber, ukuran file, perangkat, dan kondisi pemrosesan. Anda disarankan untuk memeriksa ulang hasil sebelum digunakan untuk kebutuhan penting, komersial, hukum, atau publikasi.</p>
          </LegalSection>

          <LegalSection title="7. Kekayaan intelektual">
            <p>Nama layanan, elemen desain, tata letak, identitas visual, dan materi lain yang tersedia di situs ini tetap menjadi milik pemilik layanan atau pihak yang memberikan lisensi. Anda tidak diperkenankan menyalin identitas visual atau komponen yang dilindungi hukum tanpa izin yang sesuai.</p>
          </LegalSection>

          <LegalSection title="8. Tautan pihak ketiga">
            <p>Layanan ini dapat menampilkan tautan ke situs pihak ketiga, termasuk layanan donasi, dokumentasi, atau penyedia lain. Kami tidak bertanggung jawab atas isi, kebijakan, atau praktik dari situs pihak ketiga tersebut.</p>
          </LegalSection>

          <LegalSection title="9. Penafian jaminan">
            <p>Layanan disediakan sebagaimana adanya dan sebagaimana tersedia. Tidak ada jaminan tersurat maupun tersirat terkait kelayakan untuk tujuan tertentu, hasil tertentu, atau ketersediaan tanpa gangguan.</p>
          </LegalSection>

          <LegalSection title="10. Batas tanggung jawab">
            <p>Sepanjang diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, konsekuensial, kehilangan data, kehilangan peluang, atau bentuk kerugian lain yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan.</p>
          </LegalSection>

          <LegalSection title="11. Perubahan syarat">
            <p>Syarat penggunaan dapat diperbarui sewaktu-waktu untuk menyesuaikan kebutuhan layanan, hukum, atau operasional. Versi terbaru yang ditampilkan pada halaman ini dianggap sebagai acuan yang berlaku.</p>
          </LegalSection>
        </div>
      </section>
    </>
  );
}
