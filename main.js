String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var vm = new Vue({
    el: '#form_relations_creator',
    data: {
        from: "",
        to: "",
        operator: "",
        network: "",
        code: "",
        mode: "bus"
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
