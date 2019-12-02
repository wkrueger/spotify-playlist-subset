import { getViewsPodcasts_Response, getViewsPodcasts } from "../_common/undocumentedRoutes"
import { useState, useEffect, useCallback } from "react"
import { formatError } from "../_common/formatError"
import { useFormik } from "formik"
import { FormHelper } from "../_common/FormHelper"
import { requester } from "../_common/requester"

export function Podcasts() {
  const [view, setView] = useState(null as null | getViewsPodcasts_Response)
  const [error, setError] = useState("")
  // const [country, setCountry] = useState("US")
  // const [market, setMarket] = useState("US")

  const filtersBag = useFormik({
    initialValues: {
      country: "US"
    },
    onSubmit(values) {
      reload()
    }
  })
  const h = new FormHelper(filtersBag)

  const reload = useCallback(() => {
    async function run() {
      try {
        const resp = await getViewsPodcasts({
          _betterToken: true,
          country: filtersBag.values.country,
          // locale: "en-US",
          // market,
          // timestamp: new Date().toISOString(),
          // platform: "web",
          limit: 30,
          content_limit: 20,
          types: "show"
        })
        setView(resp)
      } catch (err) {
        setError(formatError(err))
      }
    }
    run()
  }, [filtersBag.values.country])

  const showLink = useCallback((link: string) => {
    return async ev => {
      const resp = await requester.handler({} as any, { _directUrl: link })
      console.log("showLink", resp)
    }
  }, [])

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!view) return null

  return (
    <div>
      <style jsx global>{`
        .podcast {
          display: flex;
        }
        .podcast img {
          width: 150px;
          align-self: center;
          margin: 15px;
          margin-left: 0;
        }
        .podcast .content {
          flex-grow: 1;
        }
        .field {
          margin-bottom: 15px;
        }
        .field label {
          margin-right: 7px;
        }
        .field:last-child {
          margin-bottom: 0;
        }
      `}</style>
      <h1>Podcasts</h1>
      {error && <div>{error}</div>}
      <form className="filters" onSubmit={filtersBag.handleSubmit}>
        <fieldset>
          <legend>Params</legend>
          <div className="field">
            <label htmlFor="country">Country</label>
            <select {...h.bindInput("country")}>
              {countries.map(code => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            {/* <input type="text" {...h.bindInput("country")} /> */}
          </div>
          <div className="field">
            <button type="submit">Update</button>
          </div>
        </fieldset>
      </form>
      {view?.content.items.map((category, idx) => {
        console.log("category", category)
        return (
          <div className="category" key={category.id + "-" + idx}>
            <h2>{category.name}</h2>
            <div className="podcast-list">
              {category.content.items.map((podcast, idx) => {
                console.log("podcast", podcast)
                return (
                  <div className="podcast" key={podcast.uri + "-" + idx}>
                    <div className="image">
                      {podcast.images.length && <img src={podcast.images[0]?.url} />}
                    </div>
                    <div className="content">
                      <h3>{podcast.name}</h3>
                      <p>{podcast.description}</p>
                      <p>
                        {podcast.type === "show" && (
                          <a
                            href={podcast.external_urls?.spotify || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        )}
                        {podcast.type === "link" && <a onClick={showLink(podcast.href)}>Open</a>}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const countries = [
  "AD",
  "AE",
  "AR",
  "AT",
  "AU",
  "BE",
  "BG",
  "BH",
  "BO",
  "BR",
  "CA",
  "CH",
  "CL",
  "CO",
  "CR",
  "CY",
  "CZ",
  "DE",
  "DK",
  "DO",
  "DZ",
  "EC",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "GT",
  "HK",
  "HN",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IS",
  "IT",
  "JO",
  "JP",
  "KW",
  "LB",
  "LI",
  "LT",
  "LU",
  "LV",
  "MA",
  "MC",
  "MT",
  "MX",
  "MY",
  "NI",
  "NL",
  "NO",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PH",
  "PL",
  "PS",
  "PT",
  "PY",
  "QA",
  "RO",
  "SE",
  "SG",
  "SK",
  "SV",
  "TH",
  "TN",
  "TR",
  "TW",
  "US",
  "UY",
  "VN",
  "ZA"
]
