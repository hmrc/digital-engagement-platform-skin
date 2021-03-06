import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc"             %% "bootstrap-frontend-play-28" % "5.24.0",
    "uk.gov.hmrc"             %% "play-frontend-hmrc"         % "3.20.0-play-28",
    "com.vladsch.flexmark"    %  "flexmark-all"               % "0.35.10"         % "test"
  )

  val test = Seq(
    "uk.gov.hmrc"             %% "bootstrap-test-play-28"     % "5.24.0"            % Test,
    "org.jsoup"               %  "jsoup"                      % "1.15.1"            % Test,
    "com.vladsch.flexmark"    %  "flexmark-all"               % "0.36.8"            % "test, it"
  )

  val all: Seq[ModuleID] = compile ++ test
}
