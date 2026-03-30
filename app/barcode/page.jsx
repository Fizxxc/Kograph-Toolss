import PageHero from '../../components/page-hero';
import BarcodeStudio from '../../components/barcode-studio';

export default function BarcodePage() {
  return (
    <>
      <PageHero
        eyebrow="Barcode Generator"
        title="Generate barcode dengan tampilan yang bersih."
        description="Masukkan kode, pilih format, sesuaikan warna, lalu simpan hasil PNG." 
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <BarcodeStudio />
        </div>
      </section>
    </>
  );
}
