import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { useAuthContext } from '../copmonents/auth-context-provider';
import { CardOffer } from '../copmonents/card-index-page';
import { Navbar } from '../copmonents/navbar';
import stylesM from '../styles/Main.module.css';

// eslint-disable-next-line import/no-default-export
export default function Home() {
  const { user } = useAuthContext();
  return (
    <div className={stylesM.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />

      <main>
        <div className={stylesM.body1}>
          <div className={stylesM.item1}>
            <img className={stylesM.suppImg} src="/ImgSupp.png" alt="" />
          </div>

          <div className={stylesM.item2}>
            <div>
              <h1 className={stylesM.body1Napis}>BingoBalík</h1>
              <p className={stylesM.body1Odstavec}>
                Stánka, která pomáha najít vaše balíky podle vaších představ s
                nejvhodnější zásilkvou službou
              </p>
            </div>
          </div>
        </div>

        <div className={stylesM.body2}>
          <h1 className={stylesM.body2Napis}>Co vám nabízíme?</h1>
          <CardOffer
            img="lupa2.png"
            label="Nejvhodnější balíky"
            description="Zde si podle vašich parametrů můžete objednat svůj vhodný balík dle výšky, šířky, délky hmostnosti toho, co tam dáte a lokace "
          />

          <CardOffer
            img="history2.jpg"
            label="Historie"
            description="Historie objednávek, které si uživatel může prohlédnout i s nimi manipulovat. Lze je zpětně dokončit i smazat"
          />

          <CardOffer
            img="kopie.jpg"
            label="Objednání"
            description="Zde si lze i objednat balík u dopravce, který vám nejvíce vyhovuje "
          />
        </div>

        <div className={stylesM.body4}>
          <div className={stylesM.item7}>
            <img src="/confused.webp" alt="" className={stylesM.itmImg2} />
          </div>
          <div className={stylesM.item8}>
            <h1 className={stylesM.body4Napis}>Jak zde najdete svůj balík?</h1>
            <p className={stylesM.body4Odstavec}>
              Stačí kliknout na tlačítko
              <Link key="choose-supp-page" href={'/choose-supp-page'}>
                <button className={stylesM.itemBtn}>Nejvhodnější balík</button>
              </Link>
              , se kterým najdete svůj vysněný balík
            </p>
          </div>
        </div>

        <div className={stylesM.body5}>
          <div className={stylesM.item9}>
            <h1 className={stylesM.body5Napis}>Sparáva účtu a informace</h1>
            <p className={stylesM.body5Odstavec}>
              Spravovat účet lze tu též a na stránce k tomu určené najdete i
              vaši historii objednávek, lze i změnit heslo a email. Kliknutím na
              tlačítko po obrázkama se dostanete na stránku vašeho účtu
            </p>
          </div>

          <div className={stylesM.item10}>
            <img src="/s2.png" alt="" className={stylesM.itemImg} />
          </div>
          <div className={stylesM.item11}>
            <img src="/pngegg.png" alt="" className={stylesM.itemImg} />
          </div>
          {user ? (
            <div className={stylesM.item12}>
              <Link key="user-page" href={'/user-page'}>
                <button className={stylesM.itemBtn}>Spravovat účet</button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </main>
    </div>
  );
}
