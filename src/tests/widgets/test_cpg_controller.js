

(function(){
    module("Widgets - grid controller");

    function create_curve_storage_3d() {
        return BEZIER.storage.curve_storage();
    }

    function create_cpg_controller(storage){
        return BEZIER.widgets.cpg_controller(storage, function(){
            return $("<span></span>");
        });
    }

    function get_tab_titles(dom_element){
        var tabs = [];
        $(dom_element).find("ul li a").each(function(idx, elm){
            tabs.push(elm.text);
        });

        return tabs;
    }

    test("grid controller - init create the dom element", function(assert){
        var storage = create_curve_storage_3d();
        var cpg_controller = create_cpg_controller(storage);
        assert.ok(cpg_controller.dom_element);
    });

    test("grid controller - tabs stay consistent with curves in storage", function(assert){
        var storage = create_curve_storage_3d();
        var cpg_controller = create_cpg_controller(storage);
        var tabs;

        tabs = get_tab_titles(cpg_controller.dom_element);
        assert.equal(tabs.length, 0);

        storage.set_curve("one", {});
        tabs = get_tab_titles(cpg_controller.dom_element);
        assert.equal(tabs.length, 1);
        assert.equal(tabs[0], "one");

        storage.set_curve("two", {});
        tabs = get_tab_titles(cpg_controller.dom_element);
        assert.equal(tabs.length, 2);
        assert.equal(tabs[0], "one");
        assert.equal(tabs[1], "two");

        storage.set_curve("three", {});
        tabs = get_tab_titles(cpg_controller.dom_element);
        assert.equal(tabs.length, 3);
        assert.equal(tabs[0], "one");
        assert.equal(tabs[1], "two");
        assert.equal(tabs[2], "three");

        storage.clear_curve('two');
        tabs = get_tab_titles(cpg_controller.dom_element);
        assert.equal(tabs.length, 2);
        assert.equal(tabs[0], "one");
        assert.equal(tabs[1], "three");
    });

})();

