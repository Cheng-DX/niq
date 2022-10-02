#!/usr/bin/env zx
const { _: [name], i = false } = argv
const p = await fetch(`https://registry.npmjs.org/-/v1/search?text=${name}`)
const json = await p.json()
const { total, objects } = json
let packages = objects.map(({ package: { name, version, description, publisher: { username } } }) => ({ name, version, description, username }))
if (packages.length > 10)
  packages.length = 10
packages.forEach(({ name, version, username }, index) => {
  console.log(`${chalk.redBright(index)} ${chalk.green(name)} ${chalk.yellow(version)} ${chalk.blueBright(`@${username}`)}`)
})
console.log(chalk.magenta(`${total > 10
  ? `10 of ${total}`
  : `${total} found, No more packages`}`))
if (i) {
  const number = Number(await question('install> '))
  if (number > total || number < 0 || isNaN(number) || !Number.isInteger(number) || number > 10) {
    console.log(chalk.red('Invalid'))
    process.exit(1)
  } else {
    const { name: packageName, version: packageVersion } = packages[number]
    await $`ni ${packageName}@${packageVersion}`
  }
}
