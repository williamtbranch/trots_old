import got from 'got';

interface catfactDto {
  fact: string,
  length: number
}

class CatFactEndpoint {
  catfact = () => got.get('https://catfact.ninja/fact')
    .json<catfactDto>()
    .then(res => { return res.fact })
}

export default new CatFactEndpoint();