function Log() {
  return (target: object, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value; // Сохранили оригинальную функцию

    // Перезаписали оригинальную функцию на свою
    descriptor.value = function () {
      const start = new Date(); // Запомним время вызова функции

      const result = originalMethod?.apply(this); // Вызвали оригинальную функцию
      // В result будет тот результат, который вернула оригинальная функция

      const end = new Date(); // Запомним время окончания функции

      console.log({
        // Залогировали данные, имя класса, метода, время вызова, время окончания, длительность и результат
        class: target.constructor.name,
        method: methodName,
        start: start.toISOString(),
        end: end.toISOString(),
        durationMs: end.getTime() - start.getTime(),
        result,
      });

      return result; // Вернули тот результат, который вернула оригинальная функция
    };
  };
}

/**
 * Движок для работы с прогнозами погоды
 */
class WeatherEngine {
  /**
   * Функция для получения полного прогноза погоды - температура, влажность, ветер
   */
  @Log()
  public getForecast() {
    const temp = this.getTemp();
    const humidity = this.getHumidity();
    const wind = this.getWind();

    return { temp, humidity, wind };
  }

  /**
   * Функция для получения прогноза температуры.
   * Возвращает случайное число от -50 до +50
   */
  @Log()
  private getTemp() {
    const start = new Date().getTime();
    const temp = -50 + Math.round(Math.random() * 100);
    const duration = new Date().getTime() - start;

    return temp;
  }

  /**
   * Функция для получения прогноза влажности.
   * Возвращает случайное число от 10 до 70
   */
  @Log()
  private getHumidity() {
    const humidity = 10 + Math.round(Math.random() * 60);

    return humidity;
  }

  /**
   * Функция для получения прогноза ветра.
   * Возвращает случайное число от 0 до 40 и случайное направление ветра
   */
  @Log()
  private getWind() {
    // Юг, Юго-Восток, Восток, Северо-Восток, Север, Северо-Запад, Запад, Юго-Запад
    const directions = ['Ю', 'ЮВ', 'В', 'СВ', 'С', 'СЗ', 'З', 'ЮЗ'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    const speed = Math.round(Math.random() * 40);

    return { direction, speed };
  }
}

const main = () => {
  const weather = new WeatherEngine();

  const forecast1 = weather.getForecast();
  console.log('Прогноз 1:', forecast1);

  console.log();

  const forecast2 = weather.getForecast();
  console.log('Прогноз 2:', forecast2);
};

main();

class Example {
  doSomething() {
    const originalMethod = () => {
      return 1;
    };
    const start = new Date();

    const result = originalMethod?.apply(this);

    const end = new Date();

    console.log({
      class: this.constructor.name,
      method: 'doSomething',
      start: start.toISOString(),
      end: end.toISOString(),
      durationMs: end.getTime() - start.getTime(),
      result,
    });

    return result;
  }
}
