import Styles from "./HI.module.css";

export const HI = () => {
  return (
    <div className={Styles["hello__section"]}>
      <div className={Styles["hello__text"]}>
        <h2>Добро пожаловать!</h2>
        <h4>
          Мы стремимся делиться с вами красотой и разнообразием нашего города, а
          также поддерживать вас в курсе всего, что может заинтересовать и
          вдохновить. Присоединяйтесь к нам, чтобы быть частью этого
          удивительного путешествия.
        </h4>
      </div>
      <img
        src="https://cataas.com/cat"
        alt="HI_img"
        className={Styles["hi__img"]}
      />
    </div>
  );
};
