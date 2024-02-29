import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc"             %% "bootstrap-frontend-play-29" % "8.4.0",
    "uk.gov.hmrc"             %% "play-frontend-hmrc-play-29" % "8.4.0"
  )

  val test = Seq(
    "uk.gov.hmrc"             %% "bootstrap-test-play-29"     % "8.4.0"             % Test,
    "org.jsoup"               %  "jsoup"                      % "1.15.1"            % Test
  )

  val all: Seq[ModuleID] = compile ++ test
}
