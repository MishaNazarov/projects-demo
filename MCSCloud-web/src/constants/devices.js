export const DEVICE_TYPES = {
  MCS300: 0,
  MCS350: 1,
  Neptun: 2,
  Equation: 3,
  EquationProWiFi: 4,
  OKElectro: 5,
}

export const SENSOR_TYPES = [
  { value: 1, label: 'Teplolux (TST02) - 6,8 K' },
  { value: 2, label: 'AuBe 10K' },
  { value: 3, label: 'Warmup 12K' },
  { value: 4, label: 'DEVI 15K' },
  { value: 5, label: 'Eberle 33K' },
  { value: 6, label: 'Ensto 47K' },
]

export const THERMO_MODES = {
  vacation: 'vacation',
  chart: 'chart',
  manual: 'manual',
}

const defaultWaterConfig = {
  device_id: 'N3200',
  settings: {
    dry_flag: 'off',
    lines_in: {
      line_3: 'water_counter',
      line_4: 'wired_sensor',
      line_2: 'wired_sensor',
      line_1: 'wired_sensor',
    },
    relay_count: 0,
    sensors_count: 1,
    status: {
      battery_discharge_in_module: 'no',
      sensors_lost: 'no',
      battery_discharge_in_sensor: 'no',
      dry_flag: 'no',
      alert: 'off',
    },
    close_valve_flag: 'close',
    valve_settings: 'opened',
  },
  mac_address: '60:C5:A8:66:53:65',
  signal_level: 4,
  sensors_status: [
    {
      line: 2,
      attention: false,
      battery: 74,
      signal_level: 2,
    },
  ],
  access_status: 'available',
  lines_status: {
    line_3: 'off',
    line_4: 'off',
    line_2: 'off',
    line_1: 'off',
  },
}

const defaultThermoConfig = {
  current_temperature: {
    day_of_week: 1,
    event: 1,
    temperature_air: 0,
    temperature_floor: 0,
  },
  detector: 3,
  device_id: 'T2200',
  mac_address: '00:00:00:00:00:00',
  settings: {
    mode: 'vacation',
    self_training: {
      air: 'unselected',
      floor: 'unselected',
      status: 'off',
    },
    status: 'off',
    temperature_air: 0,
    temperature_correction_air: 0,
    temperature_manual: 0,
    temperature_vacation: 0,
  },
}

export const DEFAULT_CONFIG = {
  0: defaultThermoConfig,
  1: defaultThermoConfig,
  2: defaultWaterConfig,
}

export const modeImg = {
  manual: {
    img: 'mcs-finger-off',
    tooltip: 'house.device.thermo.settings.Thermoregulator.mode.manual.tooltip',
  },
  econom: {
    img: 'mcs-econom',
    tooltip: 'house.device.thermo.settings.Thermoregulator.mode.chart.econom',
  },
  comfort: {
    img: 'mcs-comfort',
    tooltip: 'house.device.thermo.settings.Thermoregulator.mode.chart.comfort',
  },
  vacation: {
    img: 'mcs-snow',
    tooltip: 'house.device.thermo.settings.Thermoregulator.mode.vacation.title',
  },
  off: {
    img: 'mcs-off',
    tooltip: 'house.device.thermo.settings.Thermoregulator.off',
  },
}

export const NOT_VALID_THERMO_TEMPERATURE = -130
