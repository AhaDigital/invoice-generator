import React, {Component} from 'react';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchCompanies } from './actions/companies';

import Header from './components/Header';
import Work from './components/Work';
import Footer from './components/Footer';

import moment from 'moment';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			invoiceTitle: '',
			invoiceNumber: 0,
			invoiceDate: moment().format('YYYY-MM-DD'),
			yourRef: '',
			ourRef: '',
			invoiceDescription: '',
			specification: [],
			credit: false,
			vatAmount: 1.25,
			vatPrice: 0,
			totalPrice: 0,
			invoiceDays: moment().add(30, 'days').format('YYYY-MM-DD'),
		};
	}

	componentDidMount() {
		this.props.fetchCompanies();
		this._updateInvoice();
	}

	_addRow() {
		let currentSpec = this.state.specification;

		currentSpec.push({
			spec: '',
			hours: 0,
			price: 0,
			vatAmount: 0,
		});

		this.setState({
			specification: currentSpec
		});
	}

	_editRow(row, event) {

		let currentSpec = this.state.specification;

		Object.keys(currentSpec).map((specRow) => {

			if(specRow === row) {
				currentSpec[row][event.name] = event.value;
			}

		});

		this.setState({
			specification: currentSpec
		});
	}

	_updateInvoice() {

		let totalExVat = 0;
		let withVat = 0;

		let vat = parseFloat(this.state.vatAmount);

		Object.keys(this.state.specification).map((spec) => {
			totalExVat += parseFloat(this.state.specification[spec].hours) * parseFloat(this.state.specification[spec].price);
		});

		withVat = Math.ceil(totalExVat * vat);

		this.setState({
			vatPrice: withVat - totalExVat,
			totalPrice: vat === 0 ? totalExVat : withVat
		});
	}

	render() {

		return (
			<div>
				<div className="editor-wrapper">
					<div className="row">
						<form onSubmit={(e) => e.preventDefault()}>
							<fieldset className="col col-2">
								<label htmlFor="invoiceTitle">
									Titel:
									<input id="invoiceNr" type="text" name="invoiceTitle" placeholder="Faktura"
									   value={this.state.invoiceTitle}
									   onChange={(e) => this.setState({invoiceTitle: e.target.value})}/>
								</label>
								<label htmlFor="invoiceNumber">
									Fakturanummer:
									<input id="invoiceNumber" type="text" name="invoiceNumber"
										   value={this.state.invoiceNumber}
										   onChange={(e) => this.setState({invoiceNumber: e.target.value})}/>
								</label>
								<label htmlFor="invoiceFor">
									Er referens:
									<textarea id="invoiceFor" type="text" name="yourRef"
										   value={this.state.yourRef}
										   onChange={(e) => this.setState({yourRef: e.target.value})}/>
								</label>
								<label htmlFor="invoiceFrom">
									Vår referens:
									<input id="invoiceFrom" type="text" name="ourRef"
										   value={this.state.ourRef}
										   onChange={(e) => this.setState({ourRef: e.target.value})}/>
								</label>
								{
									//Todo: Days.
								}
							</fieldset>
							<fieldset className="col col-2">
								<label htmlFor="invoiceDescription">
									Beskrivning:
									<textarea id="invoiceDescription" placeholder="Detta är fakturan för arbeten..." name="invoiceDescription"
											  value={this.state.invoiceDescription}
											  onChange={(e) => this.setState({invoiceDescription: e.target.value})}/>
								</label>
							</fieldset>
							<div className="col col-7">
								
								<div>
									<label>
										Kreditfaktura:
										<input type="checkbox" name="credit"
											value={this.state.credit}
											checked={this.state.credit}
											onChange={() => this.setState({credit: !this.state.credit})}/>
									</label>
								</div>
								<div>
									<label>
										Moms&nbsp;
										<select name="vatAmount" onChange={(e) => this.setState({vatAmount: e.target.value})} value={this.state.vatAmount}>
											<option value="1.25">25%</option>
											<option value="1.12">12%</option>
											<option value="1.06">6%</option>
											<option value="0">Faktura exkl moms</option>
										</select>
									</label>
								</div>
								<h2 className="margin-sm">Specifikationer:</h2>
								{
									Object.keys(this.state.specification).map((spec) => (
										<fieldset key={'spec-' + spec} className="row">
											<div className="col col-6">
												<label>
													Utfört arbete
													<input type="text" name="spec"
														   value={this.state.specification[spec].spec}
														   onChange={(e) => this._editRow(spec, e.target)}/>
												</label>
											</div>
											<div className="col col-3">
												<label>
													Timmar
													<input type="text" name="hours"
														   value={this.state.specification[spec].hours}
														   onChange={(e) => this._editRow(spec, e.target)}/>
												</label>
											</div>
											<div className="col col-3">
												<label>
													Arvode
													<input type="text" name="price"
														   value={this.state.specification[spec].price}
														   placeholder="+"
														   onChange={(e) => this._editRow(spec, e.target)}/>
												</label>
											</div>
										</fieldset>
									))
								}
								<button onClick={() => this._addRow()}>Lägg till rad</button>
								<button onClick={() => this._updateInvoice()}>Uppdatera pris</button>
							</div>
						</form>
					</div>
				</div>
				<div className="desktop-wrapper">
					<Header {...this.state} />
					<Work {...this.state} />
					<Footer/>
				</div>
			</div>
		);
	}
}


function mapStateToProps(state) {

	return {
		companiesFetched: state.companiesFetched
	}
}

function mapDispachToProps(dispatch) {

	return bindActionCreators({
		fetchCompanies
	}, dispatch);
}

export default connect(mapStateToProps, mapDispachToProps)(App);
