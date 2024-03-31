import Link from "next/link";
import Styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={Styles["footer"]}>
      <div className={Styles["footer__content"]}>
        <img src="/logo.svg" alt="footer logo" />
        <h4>Афиша мероприятий Перми © 2024</h4>
        <div className={Styles["header__nav-telegramm"]}>
          <Link href="https://t.me/+jJU_wLNjAfRiMDYy">
            <img src="/telegram.svg" alt="telegram" width={30} />
          </Link>
        </div>
      </div>
    </footer>
  );
};
