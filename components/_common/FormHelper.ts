interface WithValues<Values> {
  values: Values
  handleChange: (ev: any) => any
  handleBlur: (ev: any) => any
  touched: Partial<Record<keyof Values, any>>
  errors: Partial<Record<keyof Values, any>>
  setFieldValue: Function
}

export class FormHelper<Values extends {}> {
  constructor(public ctrl: WithValues<Values>) {}

  bindInput(field: keyof Values) {
    return {
      name: field,
      id: field,
      value: this.ctrl.values[field],
      onChange: ev => {
        return this.ctrl.handleChange(ev)
      },
      onBlur: ev => this.ctrl.handleBlur(ev),
      error: (this.ctrl.touched[field] && this.ctrl.errors[field]) || undefined
    }
  }

  bindInputDropdown(field: keyof Values) {
    return {
      name: field,
      id: field,
      value: this.ctrl.values[field] || "",
      onChange: (_ev, { value }: any) => {
        this.ctrl.setFieldValue(field, value)
      },
      // onBlur: ev => this.ctrl.handleBlur(ev),
      error: (this.ctrl.touched[field] && this.ctrl.errors[field]) || undefined
    }
  }
}
