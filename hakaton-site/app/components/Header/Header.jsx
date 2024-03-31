"use client";

import Link from "next/link";
import Styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={Styles["header"]}>
      <Link href="/">
        <img className={Styles["header__logo"]} src="/logo.svg" alt="logo" />
      </Link>
      <nav className={Styles["header__nav"]}>
        <ul>
          <li>
            <Link className={Styles["header__nav-link"]} href="/theatre">
              Театр
            </Link>
          </li>
          <li>
            <Link className={Styles["header__nav-link"]} href="/cinema">
              Кино
            </Link>
          </li>
          <li>
            <Link className={Styles["header__nav-link"]} href="/concerts">
              Концерты
            </Link>
          </li>
          <li>
            <Link className={Styles["header__nav-link"]} href="/exhibitions">
              Выставки
            </Link>
          </li>
          <li>
            <Link className={Styles["header__nav-link"]} href="/forkids">
              Детям
            </Link>
          </li>
        </ul>
      </nav>
      <div className={Styles["container"]}>
        <div className={Styles["search-box"]}>
          <input
            type="text"
            className={Styles["search-input"]}
            placeholder="Поиск..."
          />
          <img
            src="/search.svg"
            alt="search"
            className={Styles["search-icon"]}
          />
        </div>
      </div>
      <div className={Styles["header__nav-telegramm"]}>
        <Link href="https://t.me/+jJU_wLNjAfRiMDYy">
          <img src="/telegram.svg" alt="telegram" width={30} />
        </Link>
      </div>
    </header>
  );
};
