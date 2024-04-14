import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Faq from 'App/Models/Faq'

export default class FaqSeeder extends BaseSeeder {
  public async run () {
    await Faq.createMany([
      {
        question: 'Is it accessible ?',
        answer: 'Yes. It adheres to the WAI-ARIA design pattern.',
        rank: 1,
      },
      {
        question: 'Is it styled?',
        answer: 'Yes. It comes with default styles that matches the other components\' aesthetic.',
        rank: 2,
      },
      {
        question: 'Is it animated?',
        answer: 'Yes. It\'s animated by default, but you can disable it if you prefer.',
        rank: 3,
      },
    ])
  }
}
