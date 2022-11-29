import { getDmsName, getDmsHost } from './deql-ms-server/tools/utils/index';
export default {
  port: '5001',
  projectName: 'dms-gisogd-gems-sync' + getDmsName(),
  host: getDmsHost(),
  restartAppTimeout: 5000,
  graphql: {
    engineApiKey: 'service:deql-ms-server:4bBKVv14mLq7dWyaQeqfjA',
    useEngine: false,
  },
  redis: {
    host: '110.10.0.212',
    port: 32768,
    password: 'mapcam-redispass',
  },
  mongodb: {
    options: {
      host: '110.10.0.212',
      port: 27020,
    },
    username: 'vsweb',
    password: 'mapcam-vsweb-mongodbpass',
    dbName: 'admin',
  },
  gis: {
    login: 'gisogdsyncbotplan',
    password: 'wygfh2y40fhahgf3804fslbfp9834hfjkbnfds',
    host: '110.10.0.211',//'geo.cap.ru',//'110.10.0.211'
    port: '8888',
    layerSyncPeriod: 30000,// 2592000 //примерно месяц в милисекундах 60×60×24×30
    projectId: '42',//'88',
    syncLayersPrefix: 'gisogdplan' as 'gisogdgenplan' | 'gisogdzemlya',
    http: 'http' as 'http' | 'https',
  },
  gisogdGems: {
    redirectHost: 'localhost',
    redirectPort: '5001',
    host: 'gemsdev.reinform-int.ru',//'isogd.cap.ru', //
    isNeedSpecifyPort: true,
    port: '443',
    username: 'geoworks_gisogd_sync',
    password: 'P@ssw0rd',
    clientId: 'jetClient',
    clientSecret: 'jetClientSecret',//'4153df9b-6a0d-4a86-8a5d-e3084517183c', //'jetClientSecret',
    projectAlias: 'batyrevskii',//'batyrevskii',
    scope: 'jetapi offline_access',
    layersIds: 'batyrevskii:batyrevskii_geo_egrn_coastline_boundaries',//'batyrevskii:batyrevskii_geo_egrn_coastline_boundaries',
    //gisogdgenplan 'chuvashia:chuvashia_geo_urban_10_functional_zone,chuvashia:chuvashia_geo_urban_10_adm_border_city_settlement_exist,chuvashia:chuvashia_geo_urban_10_adm_border_go_division_exist,chuvashia:chuvashia_geo_urban_10_adm_border_go_exist,chuvashia:chuvashia_geo_urban_10_adm_border_in_city_district_exist,chuvashia:chuvashia_geo_urban_10_adm_border_mr_exist,chuvashia:chuvashia_geo_urban_10_adm_border_np_exist,chuvashia:chuvashia_geo_urban_10_adm_border_sel_settlement_exist,chuvashia:chuvashia_geo_urban_10_adm_border_territory_in_city_exist,chuvashia:chuvashia_geo_urban_10_adme_mo_city_settlement_exist,chuvashia:chuvashia_geo_urban_10_adme_mo_in_city_district_exist,chuvashia:chuvashia_geo_urban_10_adme_mo_sel_settlement_exist,chuvashia:chuvashia_geo_urban_10_adme_mo_territory_in_city_exist,chuvashia:chuvashia_geo_urban_10_adme_mogo_division_exist,chuvashia:chuvashia_geo_urban_10_adme_mogo_exist,chuvashia:chuvashia_geo_urban_10_adme_momr_exist,chuvashia:chuvashia_geo_urban_10_adme_np_exist,chuvashia:chuvashia_geo_urban_10_agriculture_exist,chuvashia:chuvashia_geo_urban_10_agriculture_omz_go_exist,chuvashia:chuvashia_geo_urban_10_air_transport_obj_exist,chuvashia:chuvashia_geo_urban_10_air_transport_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_authority_service_exist,chuvashia:chuvashia_geo_urban_10_authority_service_omz_go_exist,chuvashia:chuvashia_geo_urban_10_auto_service_exist,chuvashia:chuvashia_geo_urban_10_auto_service_omz_go_exist,chuvashia:chuvashia_geo_urban_10_cemetery_exist,chuvashia:chuvashia_geo_urban_10_cemetery_omz_go_exist,chuvashia:chuvashia_geo_urban_10_coastal_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_culture_exist,chuvashia:chuvashia_geo_urban_10_culture_omz_go_exist,chuvashia:chuvashia_geo_urban_10_custom_control_exist,chuvashia:chuvashia_geo_urban_10_custom_control_omz_go_exist,chuvashia:chuvashia_geo_urban_10_drink_water_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_education_exist,chuvashia:chuvashia_geo_urban_10_education_omz_go_exist,chuvashia:chuvashia_geo_urban_10_electric_line_exist,chuvashia:chuvashia_geo_urban_10_electric_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_electric_power_station_exist,chuvashia:chuvashia_geo_urban_10_electric_power_station_omz_go_exist,chuvashia:chuvashia_geo_urban_10_electric_transformer_exist,chuvashia:chuvashia_geo_urban_10_electric_transformer_omz_go_exist,chuvashia:chuvashia_geo_urban_10_emergency_protection_obj_exist,chuvashia:chuvashia_geo_urban_10_emergency_protection_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_eng_protection_obj_line_exist,chuvashia:chuvashia_geo_urban_10_eng_protection_obj_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_gas_facility_exist,chuvashia:chuvashia_geo_urban_10_eng_protection_obj_point_exist,chuvashia:chuvashia_geo_urban_10_eng_protection_obj_point_omz_go_exist,chuvashia:chuvashia_geo_urban_10_eng_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_env_monitoring_exist,chuvashia:chuvashia_geo_urban_10_env_monitoring_omz_go_exist,chuvashia:chuvashia_geo_urban_10_fish_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_flood_area_exist,chuvashia:chuvashia_geo_urban_10_foreshore_exist,chuvashia:chuvashia_geo_urban_10_forest_exist,chuvashia:chuvashia_geo_urban_10_forest_park_exist,chuvashia:chuvashia_geo_urban_10_gas_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_gas_pipeline_exist,chuvashia:chuvashia_geo_urban_10_gas_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_health_exist,chuvashia:chuvashia_geo_urban_10_health_omz_go_exist,chuvashia:chuvashia_geo_urban_10_heritage_exist,chuvashia:chuvashia_geo_urban_10_heritage_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_hydraulic_structures_line_exist,chuvashia:chuvashia_geo_urban_10_hydraulic_structures_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_hydraulic_structures_point_exist,chuvashia:chuvashia_geo_urban_10_hydraulic_structures_point_omz_go_exist,chuvashia:chuvashia_geo_urban_10_hydro_line_exist,chuvashia:chuvashia_geo_urban_10_hydro_polygon_exist,chuvashia:chuvashia_geo_urban_10_manufacturing_exist,chuvashia:chuvashia_geo_urban_10_manufacturing_omz_go_exist,chuvashia:chuvashia_geo_urban_10_nature_protect_area_point_exist,chuvashia:chuvashia_geo_urban_10_nature_protect_area_polygon_exist,chuvashia:chuvashia_geo_urban_10_nature_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_oil_facility_exist,chuvashia:chuvashia_geo_urban_10_oil_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_oil_pipeline_exist,chuvashia:chuvashia_geo_urban_10_oil_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_other_object_exist,chuvashia:chuvashia_geo_urban_10_other_object_omz_go_exist,chuvashia:chuvashia_geo_urban_10_other_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_other_zone_exist,chuvashia:chuvashia_geo_urban_10_pipeline_exist,chuvashia:chuvashia_geo_urban_10_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_prison_exist,chuvashia:chuvashia_geo_urban_10_prison_omz_go_exist,chuvashia:chuvashia_geo_urban_10_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_public_exist,chuvashia:chuvashia_geo_urban_10_public_omz_go_exist,chuvashia:chuvashia_geo_urban_10_public_transport_line_exist,chuvashia:chuvashia_geo_urban_10_public_transport_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_public_transport_obj_exist,chuvashia:chuvashia_geo_urban_10_public_transport_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_public_transport_service_exist,chuvashia:chuvashia_geo_urban_10_public_transport_service_omz_go_exist,chuvashia:chuvashia_geo_urban_10_public_transport_stops_exist,chuvashia:chuvashia_geo_urban_10_public_transport_stops_omz_go_exist,chuvashia:chuvashia_geo_urban_10_railway_facility_exist,chuvashia:chuvashia_geo_urban_10_railway_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_railway_line_exist,chuvashia:chuvashia_geo_urban_10_railway_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_recreation_exist,chuvashia:chuvashia_geo_urban_10_recreation_omz_go_exist,chuvashia:chuvashia_geo_urban_10_resort_area_point_exist,chuvashia:chuvashia_geo_urban_10_resort_area_polygon_exist,chuvashia:chuvashia_geo_urban_10_resort_exist,chuvashia:chuvashia_geo_urban_10_resort_omz_go_exist,chuvashia:chuvashia_geo_urban_10_resort_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_road_exist,chuvashia:chuvashia_geo_urban_10_road_omz_go_exist,chuvashia:chuvashia_geo_urban_10_sanitary_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_service_facility_exist,chuvashia:chuvashia_geo_urban_10_service_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_sewer_facility_exist,chuvashia:chuvashia_geo_urban_10_sewer_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_sewer_pipeline_exist,chuvashia:chuvashia_geo_urban_10_sewer_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_social_exist,chuvashia:chuvashia_geo_urban_10_social_omz_go_exist,chuvashia:chuvashia_geo_urban_10_special_economic_area_exist,chuvashia:chuvashia_geo_urban_10_sport_exist,chuvashia:chuvashia_geo_urban_10_sport_omz_go_exist,chuvashia:chuvashia_geo_urban_10_street_exist,chuvashia:chuvashia_geo_urban_10_street_omz_go_exist,chuvashia:chuvashia_geo_urban_10_street_v_exist,chuvashia:chuvashia_geo_urban_10_street_v_omz_go_exist,chuvashia:chuvashia_geo_urban_10_telecom_facility_exist,chuvashia:chuvashia_geo_urban_10_telecom_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_telecom_network_line_exist,chuvashia:chuvashia_geo_urban_10_telecom_network_line_omz_go_exist,chuvashia:chuvashia_geo_urban_10_thermal_facility_exist,chuvashia:chuvashia_geo_urban_10_thermal_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_thermal_pipeline_exist,chuvashia:chuvashia_geo_urban_10_thermal_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_transp_logistic_obj_exist,chuvashia:chuvashia_geo_urban_10_transp_logistic_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_transp_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_transport_obj_exist,chuvashia:chuvashia_geo_urban_10_transport_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_waste_facility_exist,chuvashia:chuvashia_geo_urban_10_waste_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_water_facility_exist,chuvashia:chuvashia_geo_urban_10_water_facility_omz_go_exist,chuvashia:chuvashia_geo_urban_10_water_pipeline_exist,chuvashia:chuvashia_geo_urban_10_water_pipeline_omz_go_exist,chuvashia:chuvashia_geo_urban_10_water_protection_zone_exist,chuvashia:chuvashia_geo_urban_10_water_transport_obj_exist,chuvashia:chuvashia_geo_urban_10_water_transport_obj_omz_go_exist,chuvashia:chuvashia_geo_urban_10_water_ways_exist,chuvashia:chuvashia_geo_urban_10_water_ways_omz_go_exist,chuvashia:chuvashia_geo_urban_10_wildlife_protection_exist,chuvashia:chuvashia_geo_urban_10_wildlife_protection_omz_go_exist',
    //gisogdzemplya 'chuvashia:chuvashia_geo_urban_terzone'
    //gisogdegrn 'chuvashia:chuvashia_geo_gkn_oks,chuvashia:chuvashia_geo_gkn_subparcel,chuvashia:chuvashia_geo_gkn_parcel_exist,chuvashia:chuvashia_geo_egrn_parcel_surveying_project,chuvashia:chuvashia_geo_gknspecial_zone_active,chuvashia:chuvashia_geo_gkn_terzone,chuvashia:chuvashia_geo_gkn_cadastralblocks,chuvashia:chuvashia_geo_gkn_bound,chuvashia:chuvashia_geo_egrn_coastline_boundaries,chuvashia:chuvashia_geo_gkn_oms_point'
  },
  cookieMaxAge: '86400000',
  // project_title: 'ГИС',
  NODE_ENV: 'development',
  withClient: true,
  introspectionDisable: false,
  playgroundEnable: true,
  standAloneMode: false, // если true, то нужно указать loggerConnections, иначе логи не будут отправляться в dms-logger.
  logger: {
    turnOn: true, // если логгер выключен то не будет отправлять данные на сервис dms-logger.
    // connections: {
    // настройки логгера будут браться отсюда, если standAloneMode true.
    host: '110.10.0.212',
    port: '8891',
    docker_container_name: 'dms-logger-aivanov',
    // }
  },
  rootApi: "/api",
  maintenance: false,
  nedb: {
    force: false,
    cleaner: {
      num: 2,
      type: "days",
      scheduleJob: "0 0 * * *" // every day
      /*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
    }
  }
};
