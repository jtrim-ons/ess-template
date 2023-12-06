library(tidyverse)
library(readr)
library(rstudioapi)

file_paths <- as.data.frame(list.files("csv-preprocess", pattern="\\.csv$", recursive=TRUE, full.names=TRUE))
colnames(file_paths) <- c("filePath")

file_paths <- file_paths |>
  filter(!grepl("/out/", filePath, fixed = TRUE)) |>
  filter(!grepl("_IDS", filePath, fixed = TRUE))

previous_file_paths <- read.csv("./config-data/file-names-log.csv")

new_file_paths <- file_paths |>
  filter(!filePath %in% previous_file_paths$filePath)

if (nrow(new_file_paths) > 0) {
  
  showDialog("Script not run: update file-names-log", "The script has been aborted because the list of file paths read in from the csv-preprocess folder includes files which were not present when this script was last run. These file paths can be viewed in the previous-file-paths data frame. Please add these file paths to the file-names-log.csv file in the config-data folder and re-run.")
  
  stop("Script execution aborted - update file-names-log.")
  
}

file_paths <- merge(x = file_paths, y = previous_file_paths, by = "filePath", all.x = TRUE) |>
  filter(include == "Y")

areas <- read_csv("./config-data/geography/areas.csv")

combined_data <- data.frame(stringsAsFactors=FALSE)
combined_metadata <- data.frame(stringsAsFactors=FALSE)

for (row in 1:nrow(file_paths)) {
  
  code <- sub("^.*/", "", str_replace(str_replace(file_paths[row, "filePath"], "csv-preprocess/family-ess-main/", ""),".csv", ""))
  
  indicator_data <- read_csv(file_paths[row, "filePath"], col_types = cols(period = col_character(), Period = col_character()))
  
  names(indicator_data) <- tolower(names(indicator_data))
  
  if (!is.na(file_paths[row, "valueField"]) & file_paths[row, "valueField"] != "") {
    
    names(indicator_data)[names(indicator_data) == file_paths[row, "valueField"]] <- 'value'
  }
  
  indicator_data <- indicator_data |>
    mutate(areacd = case_when(
      areacd == "TLB" ~ "E92000001",
      areacd == "TLC" ~ "E12000001",
      areacd == "TLD" ~ "E12000002",
      areacd == "TLE" ~ "E12000003",
      areacd == "TLF" ~ "E12000004",
      areacd == "TLG" ~ "E12000005",
      areacd == "TLH" ~ "E12000006",
      areacd == "TLI" ~ "E12000007",
      areacd == "TLJ" ~ "E12000008",
      areacd == "TLK" ~ "E12000009",
      areacd == "TLL" ~ "W92000004",
      areacd == "TLM" ~ "S92000003",
      areacd == "TLN" ~ "N92000002",
      TRUE ~ areacd
    ))
  
  indicator_data <- indicator_data %>%
    filter(areacd %in% areas$areacd)
  
  metadata_columns <- c("areacd", "unit", "polarity", "variable name", "indicator")
  
  if (!is.na(file_paths[row, "multiIndicatorCategory"]) & file_paths[row, "multiIndicatorCategory"] != "" & !file_paths[row, "multiIndicatorCategory"] %in% metadata_columns) {
    
    metadata_columns <- c(metadata_columns, file_paths[row, "multiIndicatorCategory"])
  }
  
  metadata_columns <- metadata_columns[metadata_columns %in% colnames(indicator_data)]
  
  #bespoke code because some of the Northern Ireland areas accidentally have the variable name left blank - hopefully will be able to     remove for a future release
  if (code == "gross-median-weekly-pay") {
    
    indicator_data <- indicator_data |>
      mutate(`variable name` = case_when(
        is.na(`variable name`) ~ "Gross median weekly pay",
        TRUE ~ `variable name`
      ))
  }
  
  if (!is.na(file_paths[row, "multiIndicatorCategory"]) & file_paths[row, "multiIndicatorCategory"] != "") {
    
    eval(parse(text = paste0('indicator_data <- indicator_data |> mutate(code = paste0(code,"-", `', file_paths[row, "multiIndicatorCategory"], '`))')))
    
    eval(parse(text = paste0('indicator_metadata <- indicator_data[, metadata_columns, drop = FALSE] |> mutate(areacd = NULL) |> mutate(code = paste0(code,"-", `', file_paths[row, "multiIndicatorCategory"], '`)) |> mutate(`', file_paths[row, "multiIndicatorCategory"], '` = NULL) |> unique()')))
    
  } else {
    
    indicator_data <- indicator_data |>
      mutate(code = code)
    
    indicator_metadata <- indicator_data[, metadata_columns, drop = FALSE] |>
      mutate(areacd = NULL) |>
      mutate(code = code) |>
      unique()
    
  }
  
  indicator_data <- indicator_data[c("areacd", "period", "value", "code")]
  combined_data <- rbind(combined_data, indicator_data)
  
  indicator_metadata <- unique(indicator_metadata) 
  combined_metadata <- bind_rows(combined_metadata, indicator_metadata)
}

periods <- as.data.frame(unique(combined_data$period))
colnames(periods) <- "period"

previous_periods <- read_csv("config-data/periods/unique-periods-lookup.csv")

new_periods <- periods |>
  filter(!period %in% previous_periods$period)

if (nrow(new_periods) > 0) {
  
  showDialog("Script not run: update unique-periods-lookup", "The script has been aborted because the identified set of periods read in from the combined data pulled from the csv files in csv-preprocess includes periods which were not present when this script was last run. These periods can be viewed in the previous-periods data frame. Please add these periods to the unique-periods-lookup.csv file in the config-data/periods folder and re-run.")
  
  stop("Script execution aborted - update unique-periods-lookup.")
  
}

periods <- previous_periods

previous_indicators <- read_csv("config-data/indicators/indicators-lookup.csv")

new_indicators <- combined_metadata |>
  filter(!code %in% previous_indicators$code)

# if (nrow(new_indicators) > 0) {
#   
#   showDialog("Script not run: update indicators-lookup", "The script has been aborted because the identified set of periods read in from the combined data pulled from the csv files in csv-preprocess includes periods which were not present when this script was last run. These periods can be viewed in the previous-periods data frame. Please add these periods to the unique-periods-lookup.csv file in the config-data/periods folder and re-run.")
#   
#   stop("Script execution aborted - update unique-periods-lookup.")
#   
# }

indicators_calculations <- previous_indicators[c("id", "code")]

combined_data <- merge(x = combined_data, y = indicators_calculations, by="code", all.x = TRUE) |>
  mutate(code = NULL)

combined_data <- merge(x = combined_data, y = periods[c("period", "xDomainNumb")], by = "period", all.x = TRUE) |>
  mutate(period = NULL)

combined_data <- combined_data |>
  filter(!is.na(value))

latest_period_data <- data.frame(stringsAsFactors=FALSE)
initial_period_data <- data.frame(stringsAsFactors=FALSE)
other_periods_data <- data.frame(stringsAsFactors=FALSE)
created_files_log <- data.frame(
  id=double(),
  type=character(),
  stringsAsFactors=FALSE)



areas_geog_level <- read_csv("./config-data/geography/areas-geog-level.csv")

for (row in 1:nrow(indicators_calculations)) {
  
  indicator_id <- as.numeric(indicators_calculations[row, "id"])
  
  indicator_data <- combined_data |>
    filter(id == indicator_id) 
  
  list_of_periods <- unique(indicator_data$xDomainNumb)
  
  indicators_calculations[row, "minXDomain"] <- min(list_of_periods)
  indicators_calculations[row, "maxXDomain"] <- max(list_of_periods)
  
  ukData <- filter(indicator_data, xDomainNumb == max(list_of_periods) & areacd == "K02000001")
  
  indicators_calculations[row, "ukValue"] <- if(nrow(ukData) > 0) ukData$value else NA
  
  gbData <- filter(indicator_data, xDomainNumb == max(list_of_periods) & areacd == "K03000001")
  
  indicators_calculations[row, "gbValue"] <- if(nrow(gbData) > 0) gbData$value else NA
  
  ewData <- filter(indicator_data, xDomainNumb == max(list_of_periods) & areacd == "K04000001")
  
  indicators_calculations[row, "ewValue"] <- if(nrow(ewData) > 0) ewData$value else NA
  
  engData <- filter(indicator_data, xDomainNumb == max(list_of_periods) & areacd == "E92000001")
  
  indicators_calculations[row, "engValue"] <- if(nrow(engData) > 0) engData$value else NA
  
  indicator_latest_period_data <- indicator_data |>
    filter(xDomainNumb == max(list_of_periods))
  
  indicator_data_for_calculations <- merge(x = indicator_data, y = areas_geog_level, by = "areacd", all.x = TRUE)
  
  indicators_calculations[row, "maxValue"] <- max(indicator_data_for_calculations$value)
  indicators_calculations[row, "minValue"] <- min(indicator_data_for_calculations$value)
  
  ltla_latest_year_data <- indicator_data_for_calculations |>
    filter(xDomainNumb == max(list_of_periods)) |>
    filter(level %in% c("both", "lower"))
  
  indicators_calculations[row, "ltCount"] <- nrow(ltla_latest_year_data)
  indicators_calculations[row, "ltMedian"] <- median(ltla_latest_year_data$value)
  
  utla_latest_year_data <- indicator_data_for_calculations |>
    filter(xDomainNumb == max(list_of_periods)) |>
    filter(level %in% c("both", "upper"))
  
  indicators_calculations[row, "utCount"] <- nrow(utla_latest_year_data)
  indicators_calculations[row, "utMedian"] <- median(utla_latest_year_data$value)
  
  latest_period_data <- rbind(latest_period_data, indicator_latest_period_data)
  
  if (length(list_of_periods) > 1) {
    
    indicator_initial_period_data <- indicator_data |>
      filter(xDomainNumb == min(list_of_periods))
    
    created_files_log <- created_files_log |>
      add_row(id=indicator_id, type="initial")
    
    write.csv(indicator_initial_period_data, paste0("./csv/initial-period/indicator-",indicator_id,".csv"), row.names = FALSE)
    
    initial_period_data <- rbind(initial_period_data, indicator_initial_period_data)
    
    latest_initial_data_for_calculations <- merge(x = indicator_latest_period_data, y = initial_period_data, by = "areacd", all.x = TRUE) |>
      mutate(percentageChange = abs((value.x - value.y)/value.y)*100) |>
      mutate(absoluteChange = abs(value.x - value.y))
    
    indicators_calculations[row, "maxPercentageChange"] <- max(na.omit(latest_initial_data_for_calculations$percentageChange))
    indicators_calculations[row, "maxAbsoluteChange"] <- max(na.omit(latest_initial_data_for_calculations$absoluteChange))
    
  }
  
  if (length(list_of_periods) > 2) {
    
    
    indicator_other_periods_data <- indicator_data |>
      filter(xDomainNumb != min(list_of_periods)) |>
      filter(xDomainNumb != max(list_of_periods))
    
    created_files_log <- created_files_log |>
      add_row(id=indicator_id, type="other")
    
    other_periods_data <- rbind(other_periods_data, indicator_other_periods_data)
    
    write.csv(other_periods_data, paste0("./csv/other-period/indicator-",indicator_id,".csv"), row.names = FALSE)
    
  }
  
}

write.csv(other_periods_data, "./csv/other-period/data.csv", row.names = FALSE)
write.csv(initial_period_data, "./csv/initial-period/data.csv", row.names = FALSE)
write.csv(latest_period_data, "./csv/latest-period/data.csv", row.names = FALSE)
write.csv(indicators_calculations, "./config-data/indicators/indicators-calculations.csv", row.names = FALSE)
write.csv(created_files_log, "./config-data/datasets-log.csv", row.names = FALSE)




indicators_metadata_for_js <- read_csv("config-data/indicators/indicators-metadata.csv")

indicators_without_metadata <- indicators_calculations |>
  filter(!code %in% indicators_metadata_for_js$code)

if (nrow(indicators_without_metadata) > 0) {
  
  showDialog("Warning: missing metadata", "This script finished executing, but noted that one or more of the indicators does not currently have associated metadata. This means that the app will error when looking for direction on how to plot data for this indicator. The data frame indicators_without_metadata contains the list of these indicators. Please add the corresponding metadata to the indicators-metadata.csv file in the config-data/indicators folder.")
  
}
