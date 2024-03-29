describe('suite of tests for the platform',function () {
    it('Router base js\' status object should not be changed', function() {
        console.log('Router base js\' status object should not be changed');
        var checksum = md5(JSON.stringify(routerSetupConfig.status));
        expect(checksum).toBe('66cf155c826f2251b2107067c39376a9');
    });
    it('Router base js\' routeTunnel() function should not be changed', function() {
        console.log('Router base js\' routeTunnel() function should not be changed');
        var checksum = md5(routerSetupConfig.routeTunnel.toString());
        expect(checksum).toBe('3802edb23129456d1278383b9040ed31');
    });
});
