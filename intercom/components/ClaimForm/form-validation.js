export default function validate(values) {
  const errors = {}
  const phoneReg = new RegExp('^(\\+7)\\d{10}$')

  if (!values.organization) {
    errors.organization = 'Обязательное поле'
  }
  if (!values.visit_date) {
    errors.visit_date = 'Обязательное поле'
  }
  if (values.visit_date <= new Date()) {
    errors.visit_date = 'Дата заполнена некорректно'
  }
  if (!values.lastname) {
    errors.lastname = 'Обязательное поле'
  }
  if (!values.firstname) {
    errors.firstname = 'Обязательное поле'
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.notification_email)) {
    errors.notification_email = 'Поле заполнено некорректно'
  }
  if (!values.notification_email) {
    errors.notification_email = 'Обязательное поле'
  }
  if (values.phone && !phoneReg.test(values.phone)) {
    errors.phone = 'Поле заполнено некорректно'
  }
  if (!values.phone) {
    errors.phone = 'Обязательное поле'
  }

  return errors
}
