import * as fs from "fs/promises" // Use promises for cleaner async/await handling
import httpStatus from "http-status"
import { AppError } from "../app/errors/app-error"

const getEmailTemplate = async (
  template: string,
  replacements: { replaceKey: string; replaceValue: string }[]
): Promise<string> => {
  try {
    const templateContent = await fs.readFile(
      `${process.cwd()}/src/mail/${template}`,
      "utf-8"
    )

    // Use a regular expression for more robust and flexible replacement
    const regex = new RegExp(/{{([^}]+)}}/g) // Match occurrences of {{ variable }}

    const replacedContent = templateContent.replace(regex, (match, key) => {
      const replacement = replacements.find(
        replacementObj => replacementObj.replaceKey === key
      )
      return replacement ? replacement.replaceValue : "" // Replace with value or empty string if not found
    })

    return replacedContent
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong")
  }
}

export default getEmailTemplate
