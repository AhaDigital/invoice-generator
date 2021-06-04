import React, { useState, useEffect, Fragment } from 'react'
import {
  AuthContext,
  Login,
  fetchInvoiceIncNr,
  saveInvoiceIncNr,
  saveNewCompany,
  fetchCompanies
} from './Firebase'
import Header from './components/Header';
import Work from './components/Work';
import Footer from './components/Footer';
import moment from 'moment';

const App = () => {
  const [ email, setEmail ] = useState()
  const [ password, setPassword ] = useState()
  const [ userId, setUserId ] = useState()
  const [ invoiceTitle, setInvoiceTitle ] = useState()
  const [ savedOrUpdatedCompany, setSavedOrUpdatedCompany ] = useState({})
  const [ invoiceNumber, setInvoiceNumber ] = useState(0)
  const [ invoiceDate, setInvoiceDate ] = useState(moment().format('YYYY-MM-DD'))
  const [ yourRefName, setYourRefName ] = useState()
  const [ yourRefCompany, setYourRefCompany ] = useState()
  const [ yourRefInfo, setYourRefInfo ] = useState()
  const [ yourRefEmail, setYourRefEmail ] = useState()
  const [ ourRef, setOurRef ] = useState()
  const [ invoiceDescription, setInvoiceDescription ] = useState()
  const [ specification, setSpecification ] = useState([])
  const [ isCreditInvoice, setIsCreditInvoice ] = useState(false)
  const [ vatAmount, setVatAmount ] = useState(1.25)
  const [ vatPrice, setVatPrice ] = useState(0)
  const [ totalPrice, setTotalPrice ] = useState(0)
  const [ invoiceDays, setInvoiceDays ] = useState()
  const [ companies, setCompanies ] = useState()
  const [ useCompany, setUseCompany ] = useState()

  const editRow = (row, event) => {
    const editSpec = [...specification]
    editSpec[row][event.name] = event.value

    setSpecification(editSpec)
	}

  const addRow = () => {
    const specifications = [...specification, {
      spec: '',
      hours: 0,
      price: 0,
      vatAmount: 0,
    }]
    setSpecification(specifications)
  }

  const updateInvoice = () => {

		let totalExVat = 0
		let withVat = 0

		let vat = parseFloat(vatAmount)

		Object.keys(specification).map((spec) => {
			return totalExVat += parseFloat(specification[spec].hours) * parseFloat(specification[spec].price)
		});

		withVat = Math.ceil(totalExVat * vat)

    setVatPrice(withVat - totalExVat)
    setTotalPrice(vat === 0 ? totalExVat : withVat)
	}

  const handleLoginSubmission = (e) => {
    e.preventDefault()
    Login(email, password)
  }

  useEffect(() => {
    if(userId && invoiceNumber === 0) {
      fetchInvoiceIncNr().then((data) => {
        const { incrementalNumber = null } = data

        if(incrementalNumber) {
          setInvoiceNumber(incrementalNumber + 1)
        }
      })
    }
  }, [userId, invoiceNumber])

  const saveOrUpdateCompany = () => {
    saveNewCompany(yourRefName, yourRefCompany, yourRefInfo).then((data) => {
      setSavedOrUpdatedCompany(data)
    })
  }

  useEffect(() => {
    if(savedOrUpdatedCompany.success !== null) {
      setTimeout(() => {
        setSavedOrUpdatedCompany({})
      }, 10000)
    }
  }, [savedOrUpdatedCompany])

  useEffect(() => {
    if(!companies) {
      fetchCompanies().then((data) => {
        setCompanies(data.map(doc => doc.data()))
      })
    }
    if(companies instanceof Object && useCompany) {
      let useCompanyMatch = null
      companies.forEach(company => {
        if(company.name === useCompany) {
          useCompanyMatch = company
        }
      })
      if(useCompanyMatch) {
        setYourRefCompany(useCompanyMatch.name)
        setYourRefName(useCompanyMatch.refName)
        setYourRefInfo(useCompanyMatch.address)
        setYourRefEmail(useCompanyMatch.email)
        setUseCompany()
      }
    }
  }, [companies, useCompany])

  const {success = null, msg = ''} = savedOrUpdatedCompany

	return (
    <AuthContext.Consumer>
      {value => {
        const { uid = null } = value || {}
        setUserId(uid)
        return (
          <Fragment>
            {/* Login */}
            {!uid && (
              <section className="editor-wrapper">
                <div className="row margin-md">
                  <div className="col col-7">
                    <h2 className="margin-md">Logga in</h2>
                    <form onSubmit={(e) => handleLoginSubmission(e)}>
                      <label htmlFor="loginEmail">
                        Email
                        <input id="loginEmail" type="email" name="name" placeholder="Användarnamn" onChange={(e) => setEmail(e.target.value)}/>
                      </label>
                      <label htmlFor="loginPassword">
                        Lösenord
                        <input type="password" name="pass" placeholder="Lösenord" onChange={(e) => setPassword(e.target.value)}/>
                      </label>
                      <button type="submit">Logga in</button>
                    </form>
                  </div>
                </div>
              </section>
            )}
            <form onSubmit={(e) => e.preventDefault()}>
              <section className="editor-wrapper">
                {/* Credit invoice, Title, Invoicenr */}
                <div className="row margin-md">
                  <fieldset className="col col-3">
                    <label htmlFor="creditInvoice">
                      <input id="creditInvoice" type="checkbox" name="credit"
                        value={isCreditInvoice}
                        checked={isCreditInvoice}
                        onChange={() => setIsCreditInvoice(!isCreditInvoice)}/>
                        &nbsp;Kreditfaktura
                    </label>
                    <label htmlFor="invoiceTitle">
                      Titel:
                      <input id="invoiceNr" type="text" name="invoiceTitle" placeholder="Faktura"
                        value={isCreditInvoice ? 'Kreditfaktura' : invoiceTitle}
                        onChange={(e) => setInvoiceTitle(e.target.value)}/>
                    </label>
                    <label htmlFor="invoiceNumber">
                      Fakturanummer:
                      <input id="invoiceNumber" type="text" name="invoiceNumber"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}/>
                    </label>
                    {uid && (
                      <button type="button" onClick={() => saveInvoiceIncNr(invoiceNumber)}>Spara fakturanummer</button>
                    )}
                  </fieldset>
                </div>
              </section>
              <section className="editor-wrapper">
                {uid && companies && (
                  <div className="row margin-md">
                    <div className="col col-7">
                      <label>
                          Hämta företagsinformation&nbsp;
                          <select 
                            name="useCompany"
                            onChange={(e) => setUseCompany(e.target.value)}
                            value={useCompany}>
                            <option value="">-</option>
                            {
                              companies.map((company, i) => (
                                <option key={`company-option-${i}`} value={company.name}>{company.name}</option>
                              ))
                            }
                          </select>
                        </label>
                    </div>
                  </div>
                )}
                <div className="row margin-md">
                  <fieldset className="col col-7">
                    <label htmlFor="invoiceFor">
                      Er referens:
                      <input id="invoiceForName" type="text" name="yourRef"
                        value={yourRefName}
                        onChange={(e) => setYourRefName(e.target.value)}/>
                    </label>
                    <label htmlFor="invoiceForCompany">
                      Företag:
                      <input id="invoiceForCompany" type="text" name="yourRefCompany"
                        value={yourRefCompany}
                        onChange={(e) => setYourRefCompany(e.target.value)}/>
                    </label>
                    <label htmlFor="invoiceForInfo">
                      Adress och företagsinformation:
                      <textarea id="invoiceForInfo" type="text" name="yourRefInfo"
                        value={yourRefInfo}
                        onChange={(e) => setYourRefInfo(e.target.value)}/>
                    </label>
                    <label htmlFor="invoiceFrom">
                      Vår referens:
                      <input id="invoiceFrom" type="text" name="ourRef"
                        value={ourRef}
                        onChange={(e) => setOurRef(e.target.value)}/>
                    </label>
                    <button type="button" onClick={() => saveOrUpdateCompany()}>
                      Spara företagsinformation
                    </button>
                    {success !== null && (
                      <p style={success ? {color: 'green'} : {color: 'red'}}>{msg}</p>
                    )}
                  </fieldset>
                  {yourRefEmail && (
                    <div className="col col-5">
                      <h3>Skickas till {yourRefEmail}</h3>
                    </div>
                  )}
                </div>
              </section>
              <section className="editor-wrapper">
                <div className="row margin-md">
                  <div className="col col-7">
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
                </div>
                <div className="row margin-md">
                  <div className="col col-7">
                    <h2 className="margin-sm">Utfört arbete</h2>
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
                </div>
                <div className="row margin-md">
                  <div className="col col-7">
                    <label htmlFor="invoiceDescription">
                      Extra rad för specification
                      <textarea id="invoiceDescription" placeholder="Specifikation: Arbeten med.." name="invoiceDescription"
                        value={invoiceDescription}
                        onChange={(e) => setInvoiceDescription(e.target.value)}/>
                    </label>
                  </div>
                </div>
              </section>
              <section className="editor-wrapper">
                <div className="row margin-md">
                  <div className="col col-7">
                    <label htmlFor="invoiceDate">
                      Dagens datum
                      <input type="text" name="price"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}/>
                    </label>
                    <label htmlFor="invoiceDate">
                      Fakturadagar
                      <select 
                        name="invoiceDays"
                        onChange={(e) => setInvoiceDays(e.target.value)}
                        value={invoiceDays}>
                        <option value="30">30 dagar</option>
                        <option value="20">20 dagar</option>
                        <option value="15">15 dagar</option>
                        <option value="10">10 dagar</option>
                      </select>
                    </label>
                  </div>
                </div>
              </section>
            </form>
            <div className="desktop-wrapper">
              <Header
                invoiceTitle={isCreditInvoice ? 'Kreditfaktura' : invoiceTitle}
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
                yourRefName={yourRefName}
                yourRefCompany={yourRefCompany}
                yourRefInfo={yourRefInfo}
                ourRef={ourRef}
              />
              <Work
                specification={specification}
                vatAmount={vatAmount}
                vatPrice={vatPrice}
                totalPrice={totalPrice}
                isCreditInvoice={isCreditInvoice}
                invoiceDays={moment(invoiceDate).add(parseInt(invoiceDays || 30, 10), 'days').format('YYYY-MM-DD')}
                invoiceDescription={invoiceDescription}
              />
              <Footer/>
            </div>
          </Fragment>
        )
      }}
    </AuthContext.Consumer>
  )
}

export default App
