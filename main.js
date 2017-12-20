String.prototype.toProperCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

var vm = new Vue({
    el: '#form_relations_creator',
    data: {
        from: "",
        to: "",
        operator: "",
        network: "",
        code: "",
        mode: "bus",
        workflow: "init",
        overpass_result: [],
        overpass_empty : false,
        overpass_spinning : false
    },
    methods: {
        overpass_query: function() {
            vm.overpass_spinning = true;
            vm.workflow = "check_existing";
            vm.overpass_empty= false;

            var network = this.network.replace(/'/g, '’')
            var operator = this.operator.replace(/'/g, '’')
            var code = this.code.replace(/'/g, '’')
            var overpass_query_url = "https://overpass-api.de/api/interpreter?data="
            overpass_query_url += "[out:json];"
            overpass_query_url += "("
            overpass_query_url += 'relation[type=route][~"network|operator"~"' + network + '|' + operator + '",i]["ref"~"^' + code + '$",i];'
            overpass_query_url += 'relation[type=route_master][~"network|operator"~"' + network + '|' + operator + '",i]["ref"~"^' + code + '$",i];'
            overpass_query_url += ");"
            overpass_query_url += "out tags;"

            fetch(overpass_query_url).then(function(response) {
                return response.json();
            }).then(function(j) {
                vm.overpass_result = j.elements
                for (var i = 0; i < vm.overpass_result.length; i++) {
                    if (vm.overpass_result[i]['tags']['type'] == "route_master") {
                        vm.overpass_result[i]['tags']['reglisse_type'] = "ligne";
                    } else {
                        vm.overpass_result[i]['tags']['reglisse_type'] = "parcours";
                    }
                    vm.overpass_result[i]['tags']['reglisse_name'] = vm.overpass_result[i]['tags']['name'] || 'relation mystère'
                    vm.overpass_result[i]['tags']['reglisse_mode'] = vm.overpass_result[i]['tags']['route'] || vm.overpass_result[i]['tags']['route_master'] || "mode inconnu"
                    vm.overpass_result[i]['tags']['reglisse_url'] = 'http://osm.org/relation/' + vm.overpass_result[i]['id']

                }
                vm.overpass_spinning = false;
                if (vm.overpass_result.length == 0) {
                    vm.overpass_empty= true;
                }
            }).catch(function(err) {
                console.log(err)
                vm.overpass_spinning = false

            });

        },
        next_step: function() {
          if (vm.workflow == 'check_existing') {
              vm.workflow= 'add_other_info';
          } else if (vm.workflow == 'add_other_info'){
            vm.workflow= 'create_josm';
          }
        }
    },
    computed: {
        route_a: function() {
            var link = "http://localhost:8111/load_data?new_layer=false&data="
            link += "<?xml version='1.0' encoding='utf-8'?> <osm version='0.6' upload='false' generator='josm'> "
            link += "<relation id='-42'>"
            link += "<tag k='from' v='" + this.from.replace(/'/g, '’') + "' /> "
            link += "<tag k='name' v='" + this.mode.toProperCase() + " " + this.code.replace(/'/g, '’') + " : " + this.from.replace(/'/g, '’') + " → " + this.to.replace(/'/g, '’') + "' /> "
            link += "<tag k='network' v='" + this.network.replace(/'/g, '’') + "' /> "
            link += "<tag k='operator' v='" + this.operator.replace(/'/g, '’') + "' /> "
            link += "<tag k='public_transport:version' v='2' /> "
            link += "<tag k='ref' v='" + this.code.replace(/'/g, '’') + "' /> "
            link += "<tag k='route' v='" + this.mode + "' /> "
            link += "<tag k='to' v='" + this.to.replace(/'/g, '’') + "' /> "
            link += "<tag k='type' v='route' /> "
            link += "</relation> </osm>"
            return link
        },
        route_b: function() {
            var link = "http://localhost:8111/load_data?new_layer=false&data="
            link += "<?xml version='1.0' encoding='utf-8'?> <osm version='0.6' upload='false' generator='josm'> "
            link += "<relation id='-424'>"
            link += "<tag k='from' v='" + this.to.replace(/'/g, '’') + "' /> "
            link += "<tag k='name' v='" + this.mode.toProperCase() + " " + this.code.replace(/'/g, '’') + " : " + this.to.replace(/'/g, '’') + " → " + this.from.replace(/'/g, '’') + "' /> "
            link += "<tag k='network' v='" + this.network.replace(/'/g, '’') + "' /> "
            link += "<tag k='operator' v='" + this.operator.replace(/'/g, '’') + "' /> "
            link += "<tag k='public_transport:version' v='2' /> "
            link += "<tag k='ref' v='" + this.code.replace(/'/g, '’') + "' /> "
            link += "<tag k='route' v='" + this.mode + "' /> "
            link += "<tag k='to' v='" + this.from.replace(/'/g, '’') + "' /> "
            link += "<tag k='type' v='route' /> "
            link += "</relation> </osm>"
            return link
        },
        route_master: function() {
            var link = "http://localhost:8111/load_data?new_layer=false&data="
            link += "<?xml version='1.0' encoding='utf-8'?> <osm version='0.6' upload='false' generator='josm'> "
            link += "<relation id='-4242'>"
            link += "<tag k='name' v='" + this.mode.toProperCase() + " " + this.code.replace(/'/g, '’') + " : " + this.from.replace(/'/g, '’') + " ↔ " + this.to.replace(/'/g, '’') + "' /> "
            link += "<tag k='network' v='" + this.network.replace(/'/g, '’') + "' /> "
            link += "<tag k='operator' v='" + this.operator.replace(/'/g, '’') + "' /> "
            link += "<tag k='ref' v='" + this.code.replace(/'/g, '’') + "' /> "
            link += "<tag k='route_master' v='" + this.mode + "' /> "
            link += "<tag k='type' v='route_master' /> "
            link += "</relation> </osm>"
            return link
        },
    }
})
//http://localhost:8111/load_data?new_layer=false&data=<?xml version='1.0' encoding='utf-8'?> <osm version='0.6' upload='false' generator='josm'> <relation id='-42422'> <tag k='from' v='Fort d’Aubervilliers' /> <tag k='name' v='Bus 330 : Fort d’Aubervilliers → Raymond Queneau - Anatole France (Bobigny)' /> <tag k='network' v='RATP' /> <tag k='operator' v='RATP' /> <tag k='public_transport:version' v='2' /> <tag k='ref' v='330' /> <tag k='route' v='bus' /> <tag k='to' v='Raymond Queneau - Anatole France (Bobigny)' /> <tag k='type' v='route' /> </relation> </osm>
//http://localhost:8111/load_data?new_layer=false&data=<?xml version='1.0' encoding='utf-8'?> <osm version='0.6' upload='false' generator='josm'> <relation id='-424242'> <tag k='name' v='Bus 330 : Fort d’Aubervilliers ↔ Raymond Queneau - Anatole France (Bobigny)' /> <tag k='network' v='RATP' /> <tag k='operator' v='RATP' /> <tag k='ref' v='330' /> <tag k='route_master' v='bus' /> <tag k='type' v='route_master' /> </relation> </osm>
