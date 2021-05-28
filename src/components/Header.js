import React from 'react';
import logo from '../logo.svg';

const Header = ({
  invoiceTitle,
  invoiceDescription,
  invoiceNumber,
  invoiceDate,
  yourRef,
  ourRef
}) => {
  return (
    <header className="row">
      <div className="col col-6 margin-md">
        <img src={logo} className="logo" alt="FFMedia AB"/>
        <h1 className="h1 margin-df"></h1>
        <h2 className="h3 margin-sm"></h2>
        <p>{invoiceDescription}</p>
      </div>
      <div className="col col-6">
        <h1 className="h1 margin-sm">{invoiceTitle}</h1>
        <h2 className="h2 margin-df">Fakturanummer: {invoiceNumber}</h2>
        <div className="row margin-df">
          <div className="col col-4">
            <h3 className="h3">Utskriftsdatum:</h3>
          </div>
          <div className="col col-8">
            <p>{invoiceDate}</p>
          </div>
        </div>
        <div className="row margin-df">
          <div className="col col-4">
            <h3 className="h3">Er referens:</h3>
          </div>
          <div className="col col-8">
            <p style={{whiteSpace: 'pre-line'}}>{yourRef}</p>
          </div>
        </div>
        <div className="row margin-df">
          <div className="col col-4">
            <h3 className="h3">Vår referens:</h3>
          </div>
          <div className="col col-8">
            <p>{ourRef}</p>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <h4 className="h3 margin-sm">Adress:</h4>
          </div>
          <div className="col col-8">
            <p><span>Aha Digital AB</span> c/o Tatsumi Suzuki</p>
            <p>Bergsunds Strand 13, 7tr</p>
            <p>117 38 Stockholm</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
