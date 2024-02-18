import { Worker } from '../interfaces/data.interface'
import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_WORKERS,
} from './constants/localeStorage'

const companyNames = [
  'Apple',
  'Google',
  'Microsoft',
  'Amazon',
  'Facebook',
  'Tesla',
  'Netflix',
  'Twitter',
  'Uber',
  'Airbnb',
  'Intel',
  'Adobe',
  'Salesforce',
  'Oracle',
  'IBM',
  'HP',
  'Dell',
  'Cisco',
  'Nvidia',
  'Qualcomm',
  'Samsung',
  'Sony',
  'LG',
  'Panasonic',
  'Toyota',
  'Honda',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  'Ford',
]

// Генерация случайного числа в диапазоне от min до max включительно
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomName() {
  const names = [
    'Макар',
    'Наум',
    'Алиса',
    'Наталья',
    'Варвара',
    'Андрей',
    'Борис',
    'Дмитрий',
    'София',
    'Кузьма',
    'Антон',
    'Венедикт',
    'Геннадий',
    'Святополк',
  ]
  const name = names[getRandomInt(0, names.length - 1)]
  return name
}
function getRandomSurname() {
  const surnames = [
    'Смирнов',
    'Кузнецов',
    'Дорофеев',
    'Назаров',
    'Лукин',
    'Вишняков',
    'Семёнов',
    'Голубев',
    'Филиппов',
    'Тимофеев',
    'Алексеев',
    'Абрамов',
  ]
  const surname = surnames[getRandomInt(0, surnames.length - 1)]
  return surname
}
function getRandomPost() {
  const posts = [
    'Кладовщик',
    'Начальник отдела',
    'Менеджер продаж',
    'Бухгалтер',
    'Диспетчер',
    'Инженер',
    'Конструктор',
    'Метролог',
    'Технолог',
    'Заведующий архивом',
    'Начальник смены',
    'Юрист',
    'Консультант',
    'Зам. Директора',
    'Директор',
  ]
  const post = posts[getRandomInt(0, posts.length - 1)]
  return post
}

function getRandomAddress() {
  const addresses = [
    'г.Брянск, ул.Ленина,',
    'г.Москва, ул.Лужнина,',
    'г.Санкт-Пербург, ул.Элес,',
    'г.Лондон, ул.Давича,',
    'г.Рио, ул.Борисова,',
    'г.Владимир, ул.Пушкина,',
    'г.Пенза, ул.Авиамоторная,',
    'г.Тамбов, ул.Академика Варги ,',
    'г.Севастополь, ул.Башиловская,',
    'г.Кострома, ул.Вербная,',
    'г.Орёл, ул.Гаражная,',
    'г.Челябинск, ул.Дворникова ,',
    'г.Псков, ул.Енисейская,',
    'г.Белгород, ул.Жулебинская ,',
    'г.Воронеж, ул.Ибрагимова ,',
  ]
  const address = addresses[getRandomInt(0, addresses.length - 1)]
  return address
}

const getMock = () => {
  // Генерация массива компаний
  const companiesMock = Array.from({ length: 50 }, (_, index) => {
    const compName = companyNames[getRandomInt(0, companyNames.length - 1)]
    return {
      id: `${index}-${compName}-compId`,
      name: compName,
      workersCount: getRandomInt(1, 30),
      address: `${getRandomAddress()} д.${index}`,
    }
  })

  // Генерация массивов работников для каждой компании
  const workersMock = companiesMock.reduce(
    (acc: { [key in string]: Worker[] }, company) => {
      const workers = Array.from(
        { length: company.workersCount },
        (_, index) => ({
          id: `${index}-workerId`,
          companyId: company.id,
          name: getRandomName(),
          surname: getRandomSurname(),
          post: getRandomPost(),
        })
      )
      acc[company.id] = workers
      return acc
    },
    {}
  )

  return { companiesMock, workersMock }
}

export const getDataMock = async () => {
  const { companiesMock, workersMock } = getMock()

  localStorage.clear()
  localStorage.setItem(LOCAL_STORAGE_COMPANIES, JSON.stringify(companiesMock))
  localStorage.setItem(LOCAL_STORAGE_WORKERS, JSON.stringify(workersMock))
}
