import React from 'react';

const Footer = () => {
	return (
		<footer>
			<div className="row">
				<div className="col col-3 margin-sm">
					<p className="h3">E-post:</p>
					<p>c.fredrikssons@gmail.com</p>
				</div>
				<div className="col col-3 margin-sm">
					<p className="h3">Telefon:</p>
					<p>+46 (0) 735-90 06 53</p>
				</div>
				<div className="col col-3 margin-sm">
					<p className="h3">Organisationsnummer:</p>
					<p>891022-0386</p>
					<p>Godkänd för F-skatt</p>
				</div>
				<div className="col col-3 margin-sm">
					<p className="h3">Säte:</p>
					<p>Stockholm</p>
				</div>
			</div>
		</footer>
	)
}
export default Footer
