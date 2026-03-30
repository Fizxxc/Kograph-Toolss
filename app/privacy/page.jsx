import PageHero from '../../components/page-hero';

function LegalSection({ title, children }) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      <div className="legal-copy">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Kebijakan Privasi"
        title="Cara data digunakan"
        description="Halaman ini menjelaskan jenis data yang dapat diproses, alasan pemrosesan, dan pilihan yang dapat Anda ambil saat menggunakan layanan."
      />
      <section className="section-block">
        <div className="wrap legal-wrap">
          <LegalSection title="1. Data yang dapat diproses">
            <p>Saat Anda menggunakan layanan, sistem dapat memproses file yang Anda unggah, seperti gambar, video, dokumen, teks, maupun input lain yang Anda masukkan ke dalam form. Sistem juga dapat mencatat data teknis dasar seperti jenis browser, ukuran file, waktu proses, atau status kegagalan untuk membantu menjaga kualitas layanan.</p>
          </LegalSection>

          <LegalSection title="2. Tujuan penggunaan data">
            <p>Data diproses untuk menjalankan fitur yang Anda pilih, menghasilkan output, menjaga stabilitas layanan, menangani error, meningkatkan pengalaman penggunaan, dan mengamankan sistem dari penyalahgunaan.</p>
          </LegalSection>

          <LegalSection title="3. File yang Anda unggah">
            <p>Anda bertanggung jawab memastikan file yang diunggah tidak melanggar hak pihak lain dan tidak memuat data sensitif yang tidak seharusnya dibagikan. Sebelum mengunggah, mohon tinjau kembali isi file, terutama jika berisi informasi pribadi, finansial, identitas, rahasia dagang, atau dokumen internal.</p>
          </LegalSection>

          <LegalSection title="4. Penyimpanan dan retensi">
            <p>Kami berupaya membatasi penyimpanan file selama diperlukan untuk menjalankan proses. Namun, mekanisme penyimpanan, cache, log, atau backup teknis dapat berbeda tergantung lingkungan deployment, penyedia infrastruktur, dan kebutuhan operasional.</p>
          </LegalSection>

          <LegalSection title="5. Cookies dan penyimpanan lokal">
            <p>Layanan dapat menggunakan penyimpanan lokal atau mekanisme serupa untuk menjaga preferensi antarmuka, membantu proses sementara, atau meningkatkan kenyamanan penggunaan. Anda dapat menghapus data tersebut melalui browser jika diperlukan.</p>
          </LegalSection>

          <LegalSection title="6. Berbagi dengan pihak lain">
            <p>Kami tidak bermaksud menjual data pribadi Anda. Namun, data tertentu dapat diproses oleh penyedia infrastruktur, penyedia jaringan, atau layanan lain yang dibutuhkan agar sistem berjalan dengan baik. Jika Anda menekan tautan ke situs pihak ketiga, maka kebijakan situs tersebut akan berlaku.</p>
          </LegalSection>

          <LegalSection title="7. Keamanan">
            <p>Kami berupaya menerapkan langkah-langkah yang wajar untuk mengurangi risiko akses tidak sah, kehilangan data, atau penyalahgunaan. Meski demikian, tidak ada sistem yang sepenuhnya bebas risiko, sehingga Anda tetap disarankan berhati-hati saat mengunggah file.</p>
          </LegalSection>

          <LegalSection title="8. Hak dan pilihan pengguna">
            <p>Anda dapat memilih untuk tidak menggunakan layanan, menghentikan unggahan, menghapus file dari perangkat sendiri, atau membatasi informasi yang Anda bagikan. Jika Anda menjalankan layanan ini sendiri, Anda juga dapat menyesuaikan kebijakan penyimpanan dan pemrosesan sesuai kebutuhan.</p>
          </LegalSection>

          <LegalSection title="9. Pembaruan kebijakan">
            <p>Kebijakan privasi ini dapat diperbarui sewaktu-waktu untuk menyesuaikan pengembangan fitur, penyesuaian operasional, atau perubahan hukum. Versi terbaru pada halaman ini menjadi acuan yang berlaku.</p>
          </LegalSection>
        </div>
      </section>
    </>
  );
}
