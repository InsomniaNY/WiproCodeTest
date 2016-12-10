rc.header = React.createClass({
    render:function(){
        return (
        	<div className="container">
				<div className="row">
					<div className="col-md-2 col-sm-3"></div>
					<header className="col-md-8 col-sm-6" data-track="header-name">Andrew Resnick</header>
					<div className="col-md-2 col-sm-3">
						<div className="flex">
							<aside className="icons">
								<a className="icon linkedin" href="https://www.linkedin.com/in/andrew-resnick-42b23b5" target="_blank" title="LinkedIn" alt="LinkedIn" data-track="header-linkedin">
									<img src={SiteConfig.assetsDirectory + 'images/header/linkedin.png'} />
								</a>
								<a className="icon github" href="https://github.com/InsomniaNY" target="_blank" title="GitHub" alt="GitHub" data-track="header-github">
									<img src={SiteConfig.assetsDirectory + 'images/header/github.png'} />
								</a>
							</aside>
						</div>
					</div>
				</div>
			</div>
        );
    }
});
