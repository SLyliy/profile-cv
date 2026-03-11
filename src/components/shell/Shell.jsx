// 页面最外层“玻璃壳 + 背景氛围”，包住 Navbar/Home/Footer
import './Shell.css';

export default function Shell({ children }) {
  return (
    <>
      <div className="ambient" aria-hidden="true"></div>

      <div className="wrap">
        <main className="shell" id="home">
          {children}
        </main>
      </div>
    </>
  );
}
