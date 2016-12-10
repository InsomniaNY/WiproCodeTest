
// ROUTER INITIALIZE

routerSetupConfig.initialize = function() {
    console.log('router initialize()');

    this.status.currentPage = this.status.lastPage = this.status.currentRoute = null;
};


//  Because all the initialize()  functions occur very early before app.status has values like currentPage
//  we need a function to fire once during the start up and after app.status has populated

routerSetupConfig.appStatusNowReady =  function(){

    // Permanent items as react components
    ReactDOM.render(
        React.createElement( rc.header ),
        document.getElementById('headercontainer')
    ); 
    ReactDOM.render(
        React.createElement( rc.footer ),
        document.getElementById('footercontainer')
    ); 

};


// ROUTER ROUTES

routerSetupConfig.routes =  {

    // home page route uses a react component as a page
    '(?*path)': function(f, q){ this.routeTunnel('react', 'home', rc.homePageComponent, f, q); },

    // insert custom routes here, following the above format

    '*badroute': function(){ this.navigate('#', {trigger: true}); }
    // for more information on routing try reading http://mrbool.com/backbone-js-router/28001

};



// ROUTER hooks

routerSetupConfig.prePageChange =  function(){
    // any code that must happen before every page change ... place here
};

routerSetupConfig.postPageChange =  function(){
    // any code that must happen after every page change ... place here
};

routerSetupConfig.postRouteChange =  function(){
    // any code that must happen after every ROUTE change ... place here
    grandCentral.trigger('routeChange');
}







