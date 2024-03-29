import React, {Fragment} from 'react';

const Work = ({
	specification,
	vatAmount,
	vatPrice,
	totalPrice,
	isCreditInvoice,
	invoiceDays,
  invoiceDescription
}) => {

	return (
    <main className="row margin-lg">
      <table className="col col-12 margin-lg">
        <thead>
          <tr>
            <td>Specifikation</td>
            <td>Timmar</td>
            <td>Timpris</td>
            <td>Total exkl. moms</td>
          </tr>
        </thead>
        <tbody>
          {
            specification.length > 0 && Object.keys(specification).map((spec) => (

              <tr key={'spec-'+spec}>
                <td>{specification[spec].spec}</td>
                <td>{specification[spec].hours}h</td>
                <td>{specification[spec].price}kr</td>
                <td>{isCreditInvoice ? '-' + parseFloat(specification[spec].price) * parseFloat(specification[spec].hours) : parseFloat(specification[spec].price) * parseFloat(specification[spec].hours)}kr</td>
              </tr>
            ))
          }
          {invoiceDescription && (
            <tr>
              <td>{invoiceDescription}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              {
                parseFloat(vatAmount) > 0 && (
                  <Fragment>	
                    Moms&nbsp;
                    {
                      parseFloat(vatAmount) === 1.25 ? (
                        <span>25%</span>
                      ) : parseFloat(vatAmount) === 1.12 ? (
                        <span>12%</span>
                      ) : parseFloat(vatAmount) === 1.06 && (
                        <span>6%</span>
                      )
                    }
                    : {isCreditInvoice ? '-' + vatPrice : vatPrice}{parseFloat(vatAmount) === 0 ? ' SEK' : ' kr'}
                  </Fragment>
                )
              }
            </td>
            {isCreditInvoice ? (
              <td className="h3">Er tillgodo: {'-' + totalPrice}{parseFloat(vatAmount) === 0 ? ' SEK' : ' kr'}</td>
            ) : (
              <td className="h3">Att betala: {totalPrice}{parseFloat(vatAmount) === 0 ? ' SEK' : ' kr'}</td>
            )}
            
          </tr>
        </tfoot>
      </table>
      <div className="col col-4 margin-sm">
        <p className="h3">Till bankgirokonto:</p>
        <p className="margin-df">5002-3159</p>
        <p className="font-xs">Iban-nummer: SE1050000000052311100114</p>
        <p className="font-xs">SEB Bic-kod: ESSESESS</p>
      </div>
      <div className="col col-3 margin-sm">
        <p className="h3">Förfallodatum:</p>
        <p>{invoiceDays}</p>
      </div>
      <div className="col col-5 margin-sm">
        <p className="font-xs">Vi äger rätten att debitera dröjsmålsränta<br/>vid betalning efter förfallodagen.</p>
      </div>
    </main>
	)
}

export default Work
