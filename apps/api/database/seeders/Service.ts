import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Service from 'App/Models/Service'

export default class extends BaseSeeder {
  public async run () {
    await Service.createMany([
      {
        label: 'Checkin/Checkout autonome',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317119059781.png',
      },
      {
        label: 'Ménage professionnel',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/1631711882769.png',
      },
      {
        label: 'Wifi FIBRE',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317118538936.png',
      },
      {
        label: 'Savon et Gel Douche',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317118070204.png',
      },
      {
        label: 'Literie de qualité',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317117791311.png',
      },
      {
        label: 'Cuisine équipée',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317117489567.png',
      },
      {
        label: 'Serviettes fournies',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317117296737.png',
      },
      {
        label: 'Café/Thé',
        description: 'description',
        image: 'https://supermanager-img.s3.amazonaws.com/forms/16317116268495.png',
      },
    ])
  }
}
