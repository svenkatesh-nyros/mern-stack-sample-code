import React, { Component } from 'react';

import Config from '../../server/config.js';

export default class MainFooter extends Component{
	render(){
		return(
			<div>
				<footer>
					<div className="social_app_icons">
						<div className="ui container">
							<div className='ui grid'>
								<div className="two column row">
									<div className="column left">
										<div className="ftr_icons">
											<ul>
												<li><h6>Follow us</h6></li>
												<li>
													<a>
														<img src={Config.baseAssets+"images/fb_icon.png"} alt=" " />
													</a>
												</li>
												<li>
													<a>
														<img src={Config.baseAssets+"images/g_plus_icon.png"} alt=" " />
													</a>
												</li>
												<li>
													<a>
														<img src={Config.baseAssets+"images/in_icon.png"} alt=" " />
													</a>
												</li>
												<li>
													<a>
														<img src={Config.baseAssets+"images/twit_icon.png"} alt=" " />
													</a>
												</li>
											</ul>
										</div>
									</div>
									<div className="column right">
										<div className="ftr_icons aps_icons">
											<ul>
												<li>
													<h6>Mobile apps</h6>
												</li>
												<li>
													<a title="Download LaborBridge IOS App" href="https://itunes.apple.com/us/app/laborbridge/id1424807867?mt=8" target="_blank">
														<img src={Config.baseAssets+"images/ios_icon.png"} alt="" />
													</a>
												</li>
												<li>
													<a title="Download LaborBridge Android App" href="https://play.google.com/store/apps/details?id=com.laborbridge" target="_blank">
														<img src={Config.baseAssets+"images/android_icon.png"} alt="" />
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="coprgt_txt">
						<p>Copyright © 2018 LaborBridge.</p>
					</div>
				</footer>
			</div>
		);
	}
}