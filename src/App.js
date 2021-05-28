import React, { useState, Fragment } from 'react'

import Header from './components/Header';
import Work from './components/Work';
import Footer from './components/Footer';

import moment from 'moment';

const App = () => {
  const [ invoiceTitle, setInvoiceTitle ] = useState()
  const [ invoiceNumber, setInvoiceNumber ] = useState(0)
  const [ invoiceDate, setInvoiceDate ] = useState(moment().format('YYYY-MM-DD'))
  const [ yourRef, setYourRef ] = useState()
  const [ ourRef, setOurRef ] = useState()
  const [ invoiceDescription, setInvoiceDescription ] = useState()
  const [ specification, setSpecification ] = useState([])
  const [ isCreditInvoice, setIsCreditInvoice ] = useState(false)
  const [ vatAmount, setVatAmount ] = useState(1.25)
  const [ vatPrice, setVatPrice ] = useState(0)
  const [ totalPrice, setTotalPrice ] = useState(0)
  const [ invoiceDays, setInvoiceDays ] = useState(moment().add(30, 'days').format('YYYY-MM-DD'))

  const editRow = (row, event) => {
		let currentSpec = specification

		Object.keys(currentSpec).map((specRow) => {
			if(specRow === row) {
				currentSpec[row][event.name] = event.value
			}
		})
    setSpecification(currentSpec)
    return
	}

  const addRow = () => {
		let currentSpec = specification

		currentSpec.push({
			spec: '',
			hours: 0,
			price: 0,
			vatAmount: 0,
		})

    setSpecification(currentSpec)
    return
	}

  const updateInvoice = () => {

		let totalExVat = 0
		let withVat = 0

		let vat = parseFloat(vatAmount)

		Object.keys(specification).map((spec) => {
			totalExVat += parseFloat(specification[spec].hours) * parseFloat(specification[spec].price)
		});

		withVat = Math.ceil(totalExVat * vat)

    setVatPrice(withVat - totalExVat)
    setTotalPrice(vat === 0 ? totalExVat : withVat)
    return
	}

	return (
    <Fragment>
      <div className="editor-wrapper">
        <div className="row">
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="col col-2">
              <label htmlFor="invoiceTitle">
                Titel:
                <input id="invoiceNr" type="text" name="invoiceTitle" placeholder="Faktura"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}/>
              </label>
              <label htmlFor="invoiceNumber">
                Fakturanummer:
                <input id="invoiceNumber" type="text" name="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}/>
              </label>
              <label htmlFor="invoiceFor">
                Er referens:
                <textarea id="invoiceFor" type="text" name="yourRef"
                  value={yourRef}
                  onChange={(e) => setYourRef(e.target.value)}/>
              </label>
              <label htmlFor="invoiceFrom">
                Vår referens:
                <input id="invoiceFrom" type="text" name="ourRef"
                  value={ourRef}
                  onChange={(e) => setOurRef(e.target.value)}/>
              </label>
            </fieldset>
            <fieldset className="col col-2">
              <label htmlFor="invoiceDescription">
                Beskrivning:
                <textarea id="invoiceDescription" placeholder="Detta är fakturan för arbeten..." name="invoiceDescription"
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}/>
              </label>
            </fieldset>
            <div className="col col-7">
              <div>
                <label>
                  Kreditfaktura:
                  <input type="checkbox" name="credit"
                    value={isCreditInvoice}
                    checked={isCreditInvoice}
                    onChange={() => setIsCreditInvoice(!isCreditInvoice)}/>
                </label>
              </div>
              <div>
                <label>
                  Moms&nbsp;
                  <select 
                    name="vatAmount"
                    onChange={(e) => setVatAmount(e.target.value)}
                    value={vatAmount}>
                    <option value="1.25">25%</option>
                    <option value="1.12">12%</option>
                    <option value="1.06">6%</option>
                    <option value="0">Faktura exkl moms</option>
                  </select>
                </label>
              </div>
              <h2 className="margin-sm">Specifikationer:</h2>
              {
                Object.keys(specification).map((spec) => (
                  <fieldset key={'spec-' + spec} className="row">
                    <div className="col col-6">
                      <label>
                        Utfört arbete
                        <input type="text" name="spec"
                          value={specification[spec].spec}
                          onChange={(e) => editRow(spec, e.target)}/>
                      </label>
                    </div>
                    <div className="col col-3">
                      <label>
                        Timmar
                        <input type="text" name="hours"
                          value={specification[spec].hours}
                          onChange={(e) => editRow(spec, e.target)}/>
                      </label>
                    </div>
                    <div className="col col-3">
                      <label>
                        Arvode
                        <input type="text" name="price"
                          value={specification[spec].price}
                          placeholder="+"
                          onChange={(e) => editRow(spec, e.target)}/>
                      </label>
                    </div>
                  </fieldset>
                ))
              }
              <button onClick={() => addRow()}>Lägg till rad</button>
              <button onClick={() => updateInvoice()}>Uppdatera pris</button>
            </div>
          </form>
        </div>
      </div>
      <div className="desktop-wrapper">
        <Header
          invoiceTitle={invoiceTitle}
          invoiceDescription={invoiceDescription}
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          yourRef={yourRef}
          ourRef={ourRef}
        />
        <Work
          specification={specification}
          vatAmount={vatAmount}
	        vatPrice={vatPrice}
          totalPrice={totalPrice}
          isCreditInvoice={isCreditInvoice}
	        invoiceDays={invoiceDays}
        />
        <Footer/>
      </div>
    </Fragment>
  )
}

export default App
